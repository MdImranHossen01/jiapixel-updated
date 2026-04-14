/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import { authOptions } from './auth-config';
export * from './jwt-utils'; // Export all JWT utilities from the new dedicated file

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  if (user.role !== 'admin') throw new Error('Forbidden');
  return user;
}
