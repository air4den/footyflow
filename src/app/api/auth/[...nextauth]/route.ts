import NextAuth, { NextAuthOptions } from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import { PrismaClient } from "@/generated/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

function normalizeStravaAvatar(raw?: string | null) 
{
  if (!raw || !raw.startsWith("http")) return "/pfp.svg";
  return raw;                          
}

async function refreshAccessTooken(account: any): Promise<any> {
    try {
        const url = `https://www.strava.com/oauth/token?`
        const params = new URLSearchParams({
            client_id: process.env.STRAVA_CLIENT_ID!,
            client_secret: process.env.STRAVA_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token:  account.refresh_token!
        })
        const res = await fetch(url, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params,
            }
        )
        const refreshed = await res.json()
        if (!res.ok) throw refreshed
        console.log("Recieved 200 from GET refreshAccessToken. AccessToken: %s, refreshToken: %s, accessTokenExpires: %d", refreshed.access_token, refreshed.refresh_token, refreshed.expires_at)
        
        const newTokens = refreshed as {
            access_token: string;
            expires_at: number;
            refresh_token?: string;
        };

        await prisma.account.update({
            data: {
                access_token: newTokens.access_token,
                expires_at: newTokens.expires_at,
                refresh_token: newTokens.refresh_token,
            }, 
            where: {
                id: account.id,
            }
        })
        return newTokens;
    }
    catch (error) {
        console.error("Error refreshing Strava token", error)
        throw new Error("Error refreshing Strava token");
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    providers: [
        StravaProvider({
            clientId: process.env.STRAVA_CLIENT_ID ?? "",
            clientSecret: process.env.STRAVA_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    approval_prompt: "force",
                    scope: "read_all,activity:read_all",
                    response_type: "code",
                },
            },
            profile(profile) {
                console.log("Profile callback. Profile:", profile, "profile.id:", profile.id);
                return {
                    id: String(profile.id),
                    name: `${profile.firstname?.trim() ?? ""} ${profile.lastname?.trim() ?? ""}`,
                    username: profile.username ?? "",
                    email: null,
                    firstname: profile.firstname?.trim() ?? "",
                    lastname: profile.lastname?.trim() ?? "",
                    image: normalizeStravaAvatar(profile.profile),
                }
            },
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("Sign in callback. User:", user, "Account:", account, "Profile:", profile);
            return true;
        },
        async session({ session, user }) {
            // console.log("Session callback. Session:", session);
            const [stravaAccount] = await prisma.account.findMany({
                where: { userId: user.id },
            });
            if (stravaAccount?.expires_at && stravaAccount.expires_at < Math.floor(Date.now()/1000)) {
                console.log("Refreshing Strava token");
                const newTokens =   await refreshAccessTooken(stravaAccount);
                console.log("New tokens:", newTokens);
            }
            session.user.id = user.id;
            session.user.username = user.username;
            session.user.firstname = user.firstname;
            session.user.lastname = user.lastname;
            session.user.image = normalizeStravaAvatar(user.image);
            return session;
        },
    },
}

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };