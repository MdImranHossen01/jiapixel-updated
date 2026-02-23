import MyOrdersClient from "./MyOrdersClient";
import ClientCustomOrdersTable from "../components/ClientCustomOrdersTable";

const MyOrdersPage = () => {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <MyOrdersClient />
      </div>
      <div>
        <ClientCustomOrdersTable />
      </div>
    </div>
  );
};

export default MyOrdersPage;