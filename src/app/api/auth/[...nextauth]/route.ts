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
            console.log("Session callback. Session:", session);
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