import Link from 'next/link';
import ClientCustomOrdersTable from './components/ClientCustomOrdersTable';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Project Dashboard</h1>
        <Link
          href="/dashboard/manage-services/create"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create New Project
        </Link>
      </div>
      <Link href="/dashboard/blogs" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">

        <span>Blogs</span>
      </Link>

      <ClientCustomOrdersTable />
    </div>
  );
}