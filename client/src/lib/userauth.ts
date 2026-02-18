import NextAuth, { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema';

export const authOptions: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Changed to JWT for immediate session availability
    maxAge: 24 * 60 * 60, // 1 day
  },
  cookies: {
    sessionToken: {
      name: 'user_token', // ✅ Custom cookie name as requested
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Ensure user data is saved to database on sign in
      if (account?.provider === 'google') {
        return true;
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        // @ts-expect-error - Add custom fields
        session.user.hasCompletedProfile = token.hasCompletedProfile || false;
        // @ts-expect-error - Custom user field
        session.user.country = token.country;
        // @ts-expect-error - Custom user field
        session.user.state = token.state;
        // @ts-expect-error - Custom user field
        session.user.city = token.city;
      }
      return session;
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // @ts-expect-error - Custom user field
        token.hasCompletedProfile = user.hasCompletedProfile || false;
        // @ts-expect-error - Custom user field
        token.country = user.country;
        // @ts-expect-error - Custom user field
        token.state = user.state;
        // @ts-expect-error - Custom user field
        token.city = user.city;
      }
      
      // Handle session updates
      if (trigger === 'update') {
        // Fetch fresh user data from database
        const freshUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, token.id as string),
        });
        
        if (freshUser) {
          token.hasCompletedProfile = freshUser.hasCompletedProfile || false;
          token.country = freshUser.country;
          token.state = freshUser.state;
          token.city = freshUser.city;
        }
      }
      
      return token;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
