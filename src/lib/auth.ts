import NextAuth from 'next-auth';
import { authOptions } from './auth-config';

// Export the NextAuth instance
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions }; // Re-export for convenience or to minimize changes elsewhere
