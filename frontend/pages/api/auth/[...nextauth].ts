import { randomBytes, randomUUID } from "crypto";
import NextAuth, { AuthOptions } from "next-auth";
import { OAuthConfig } from "next-auth/providers";
import FortyTwoProvider from "next-auth/providers/42-school";
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
          image: profile.image_url,
        };
      },
    }),
  ],
  callbacks: {
    // async signIn({ profile, user, account }) {
    //   console.log("profile", profile);
    //   console.log("user", user);
    //   console.log("account", account?.userId);
    //   if (!profile || user) return false;
    //   return user;
    // },
    // async session({ session, token, trigger, user, newSession }) {
    //   session.user = user;
    //   // session.accessToken = token.accessToken;
    //   console.log("session user", user);
    //   return session;
    // },
  },
  debug: true,
  // session: {
  //   strategy: "database",
  //   maxAge: 30 * 24 * 60 * 60,
  //   updateAge: 24 * 60 * 60,
  //   generateSessionToken: () => {
  //     return randomUUID?.() ?? randomBytes(32).toString("hex");
  //   },
  // },
  pages: {
    signIn: "/login",
  },
  adapter: PostgresAdapter(pool),
};

export default NextAuth(authOptions);
