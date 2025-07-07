import NextAuth, { NextAuthOptions } from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient();

interface StravaToken extends JWT {
    access_token?: string,
    refresh_token?: string,
    expires_at?: number
    error?: string
}

async function refreshAccessTooken(token: StravaToken): Promise<StravaToken> {
    try {
        const url = `https://www.strava.com/oauth/token?`
        const params = new URLSearchParams({
            client_id: process.env.STRAVA_CLIENT_ID!,
            client_secret: process.env.STRAVA_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token:  token.refresh_token!
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
        console.log("Recieved 200 from GET refreshAccessToken. AccessToken: %d, refreshToken: %d, accessTokenExpires: %d", refreshed.access_token, refreshed.refresh_token, refreshed.expires_at)
        return {
            ...token,
            access_token: refreshed.access_token,
            refresh_token: refreshed.refresh_token || token.refresh_token,
            expires_at: refreshed.expires_at * 1000,
        }
    }
    catch (error) {
        console.error("Error refreshing Strava token", error)
        return { ...token, error: "RefreshAccessTokenError" }
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        StravaProvider({
            clientId: process.env.STRAVA_CLIENT_ID ?? "",
            clientSecret: process.env.STRAVA_CLIENT_SECRET ?? "",
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            console.log("JWT callback. Token:", token, "Account:", account, "Profile:", profile);
            if (account) {
                console.log("Account exists in JWT callback.");
                token.access_token = String(account.access_token)
                token.refresh_token = String(account.refresh_token);
                token.expires_at = Number(account.expires_at) * 1000; // ms
                token.id = String(account.athlete.id);

                if (profile) {
                console.log("Profile exists in JWT callback.");
                const strava_id = String(profile.id ?? null);
                const username = profile?.username ?? null;
                const firstname = profile?.firstname ?? null;
                const lastname = profile?.lastname ?? null;
                const profilepic = profile?.profile ?? null;

                console.log("Profile:", profile);

                // TODO: put in separapte function, handle insert errors
                const existingUser = await prisma.user.findUnique({
                    where: { id: strava_id }
                });
                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            id: strava_id,
                            username: username,
                            firstname: firstname,
                            lastname: lastname,
                            profilepic: profilepic,
                            heatmaps: {}
                        }
                    });
                    console.log("Created new user in DB with id:", strava_id, "firstname:", firstname, "lastname:", lastname, "username:", username);
                }
                }

                return token;
            }

            

            if (typeof token.expires_at === "number" && Date.now() < token.expires_at) {
                return token;
            }

            return await refreshAccessTooken(token as StravaToken);
        },
        async session({ session, token }) : Promise<Session> {
            session.user.access_token = token.access_token!;
            session.user.refresh_token = token.refresh_token!;
            session.user.expires_at = token.expires_at!;
            console.log("Session callback. Session data:", session);
            return session;
        },
    },
}

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };