import NextAuth, { AuthOptions } from 'next-auth';
import FortyTwoProvider from "next-auth/providers/42-school";

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
          }
        }),
    ],
    callbacks: {
      
        async signIn({profile, user}) {
            if (!profile || user) return false;
            return user
        },

        async session({ session, token, trigger, user, newSession }) {
            session.user = user;
            // session.accessToken = token.accessToken;
            console.log('session user', user);
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

export default NextAuth(authOptions);


