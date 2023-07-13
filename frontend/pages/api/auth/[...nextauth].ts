import { randomBytes, randomUUID } from "crypto";
import NextAuth, { AuthOptions } from "next-auth";
import { OAuthConfig } from "next-auth/providers";
import FortyTwoProvider from "next-auth/providers/42-school";
import { redirect } from "next/dist/server/api-utils";
import { Pool } from "pg";
import { PostgresAdapter } from "./PostgressAdapter";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!),
});

export const authOptions: AuthOptions = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.login,
          image: profile.image.link,
          email: profile.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, user, account }) {
      if (!user) return false;
      if (typeof window !== "undefined")
        window.location.href = "http://localhost:3000/auth/login";
      return true;
    },

    async session({ session, token, trigger, user, newSession }) {
      return session;
    },
  },
  // debug: true,
  pages: {
    signIn: "/login",
  },
  // adapter: PostgresAdapter(pool),
};

export default NextAuth(authOptions);
