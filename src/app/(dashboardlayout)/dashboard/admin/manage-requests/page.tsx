import { Suspense } from "react";
import ManageRequestsClient from "./ManageRequestsClient";

const ManageRequestsPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Landing Page Requests</h1>
          <p className="text-muted-foreground">Manage leads and order requests from specialized landing pages.</p>
        </div>
      </div>
      
      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-4 font-medium">Loading dashboard...</span>
        </div>
      }>
        <ManageRequestsClient />
      </Suspense>
    </div>
  );
};

export default ManageRequestsPage;
