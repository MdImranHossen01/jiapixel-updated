import MyOrdersClient from "./MyOrdersClient";

const MyOrdersPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <MyOrdersClient/>
    </div>
  );
};

export default MyOrdersPage;