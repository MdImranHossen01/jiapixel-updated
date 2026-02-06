import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './db';
import User from '@/models/User';
import { generateTokens } from './auth-utils';

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
            console.log('✅ New user created:', user.email);
          } else {
            console.log('✅ User already exists:', user.email);
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

      // Initial sign in
      if (user && account) {
        console.log('🔐 JWT CALLBACK - Generating tokens for user:', user.email);

        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          console.log('🔐 JWT CALLBACK - Database user found:', !!dbUser);

          if (dbUser) {
            // Generate custom JWT tokens using the simple function
            console.log('🔐 JWT CALLBACK - Generating JWT tokens...');
            const tokens = await generateTokens(dbUser);
            console.log('🔐 JWT CALLBACK - Tokens generated:', {
              accessToken: tokens.accessToken ? `Present (${tokens.accessToken.length} chars)` : 'Missing',
              refreshToken: tokens.refreshToken ? `Present (${tokens.refreshToken.length} chars)` : 'Missing'
            });

            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.accessToken = tokens.accessToken;
            token.refreshToken = tokens.refreshToken;

            console.log('🔐 JWT CALLBACK - Final token with JWT:', {
              id: token.id,
              accessToken: token.accessToken ? 'Present' : 'Missing',
              refreshToken: token.refreshToken ? 'Present' : 'Missing'
            });
          }
        } catch (error) {
          console.error('🔐 JWT CALLBACK - Error generating tokens:', error);
        }
      }

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
          session.refreshToken = token.refreshToken as string;
          console.log('🔐 SESSION CALLBACK - JWT tokens added to session');
        } else {
          console.log('🔐 SESSION CALLBACK - No JWT tokens in token');
        }

        await connectDB();
        const dbUser = await User.findOne({ email: session.user?.email });

        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.role = dbUser.role;
          session.user.name = dbUser.name;
          session.user.image = dbUser.image;
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

// Export the NextAuth instance
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
