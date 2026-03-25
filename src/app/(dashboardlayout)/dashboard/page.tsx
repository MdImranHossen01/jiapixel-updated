import Link from 'next/link';
import ClientCustomOrdersTable from './components/ClientCustomOrdersTable';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Redirect based on role
  if (session.user.role === 'admin') {
    redirect('/dashboard/admin');
  } else {
    redirect('/dashboard/client');
  }

  // This part will never be reached, but needed for TS
  return null;
}