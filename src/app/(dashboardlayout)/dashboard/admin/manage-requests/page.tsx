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
      
      <ManageRequestsClient />
    </div>
  );
};

export default ManageRequestsPage;
