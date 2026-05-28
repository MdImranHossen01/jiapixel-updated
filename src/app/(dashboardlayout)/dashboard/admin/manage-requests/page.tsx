import { Suspense } from "react";
import ManageRequestsClient from "./ManageRequestsClient";

const ManageRequestsPage = () => {
  return (
    <div className="p-6">
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
