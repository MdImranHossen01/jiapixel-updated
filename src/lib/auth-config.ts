import { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './db';
import User from '@/models/User';
import { generateTokens } from './jwt-utils';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log('🔐 SIGNIN CALLBACK - Starting...');

        // Only handle Google OAuth
        if (account?.provider === 'google') {
          await connectDB();

          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: new Date(),
              role: 'user',
            });
            console.log('✅ New user created');
          } else {
            console.log('✅ User already exists');
            // Update user image if it's different
            if (user.image && existingUser.image !== user.image) {
              await User.updateOne(
                { email: user.email },
                { image: user.image }
              );
            }
          }
        }
        return true;
      } catch (error) {
        console.error('❌ SignIn callback error:', error);
        return false;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      console.log('🔐 JWT CALLBACK - Trigger:', trigger);
      console.log('🔐 JWT CALLBACK - User present:', !!user);
      console.log('🔐 JWT CALLBACK - Account provider:', account?.provider);

      // Always sync user data from DB — role, id, name, and image are all refreshed
      // on every request so they're never stale.
      const emailToLookup = user?.email || token?.email;
      if (emailToLookup) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: emailToLookup }).select('_id role name image');
          console.log('🔐 JWT CALLBACK - DB user found:', !!dbUser, '| Role:', dbUser?.role, '| Image:', !!dbUser?.image);

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.name = dbUser.name;
            // Use DB image if available, otherwise fall back to Google's OAuth picture
            token.image = dbUser.image || token.picture || null;
          }
        } catch (error: any) {
          console.error('🔐 JWT CALLBACK - Error fetching user from DB:', error);
        }
      }


      // Generate/refresh custom JWT tokens only on initial sign-in
      if (user && account) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            const tokens = await generateTokens(dbUser);
            token.accessToken = tokens.accessToken;
            token.refreshToken = tokens.refreshToken;
            console.log('🔐 JWT CALLBACK - Custom tokens generated on sign-in');
          }
        } catch (error: any) {
          console.error('🔐 JWT CALLBACK - Error generating tokens:', error);
          token.error = error.message || 'TokenGenerationError';
        }
      }

      console.log('🔐 JWT CALLBACK - Final token role:', token.role);
      return token;
    },

    async session({ session, token }) {
      console.log('🔐 SESSION CALLBACK - Token keys:', Object.keys(token));
      console.log('🔐 SESSION CALLBACK - Access token in token:', !!token.accessToken);
      console.log('🔐 SESSION CALLBACK - Refresh token in token:', !!token.refreshToken);

      try {
        if (token.error) {
          session.error = token.error as string;
        }

        if (token.accessToken) {
          session.accessToken = token.accessToken as string;
          // Audit finding: Only assign if defined
          if (token.refreshToken) {
            session.refreshToken = token.refreshToken as string;
          }
          console.log('🔐 SESSION CALLBACK - JWT tokens added to session');
        }

        // Performance Optimization: Populate session user from the JWT token
        // This avoids calling User.findOne on every request
        if (token.id) {
          session.user = {
            ...session.user,
            id: typeof token.id === 'string' ? token.id : String(token.id),
            role: typeof token.role === 'string' ? token.role : undefined,
            name: typeof token.name === 'string' ? token.name : undefined,
            image: typeof token.image === 'string' ? token.image : undefined,
          };
          console.log('🔐 SESSION CALLBACK - User data populated from JWT - Role:', token.role);
        }

        console.log('🔐 SESSION CALLBACK - Final session keys:', Object.keys(session));

        return session;
      } catch (error) {
        console.error('❌ Session callback error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
