import { Suspense } from "react";
import ManageBillsClient from "./ManageBillsClient";

const ManageBillsPage = () => {
  return (
    <div className="p-6">
      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-4 font-medium">Loading billing system...</span>
        </div>
      }>
        <ManageBillsClient />
      </Suspense>
    </div>
  );
};

export default ManageBillsPage;
