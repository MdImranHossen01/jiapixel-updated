import Link from 'next/link';
import ClientCustomOrdersTable from './components/ClientCustomOrdersTable';

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Project Dashboard</h1>
        <Link
          href="/dashboard/manage-services/create"
          className="w-full sm:w-auto text-center bg-primary text-primary-foreground px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create New Project
        </Link>
      </div>
      <Link href="/dashboard/blogs" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent -ml-2 w-max">
        <span className="text-sm md:text-base">Blogs</span>
      </Link>

      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-[600px] w-full">
          <ClientCustomOrdersTable />
        </div>
      </div>
    </div>
  );
}