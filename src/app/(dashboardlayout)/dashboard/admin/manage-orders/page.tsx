import ManageOrdersClient from "./ManageOrdersClient";

const ManageOrdersPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <ManageOrdersClient/>
    </div>
  );
};

export default ManageOrdersPage;