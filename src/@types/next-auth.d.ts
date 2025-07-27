import "next-auth";

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
      firstname?: string;
      lastname?: string;
      profilepic?: string;
    }
  }
  
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
    firstname?: string;
    lastname?: string;
    profilepic?: string;
  }
}