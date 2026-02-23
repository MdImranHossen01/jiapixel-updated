import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ManageCustomOrdersClient from "./ManageCustomOrdersClient";

export const metadata = {
    title: "Manage Custom Orders | Admin Dashboard",
    description: "Create and manage custom service packages for clients.",
};

const ManageCustomOrdersPage = () => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Custom Orders</h1>
                <Button asChild className="gap-2">
                    <Link href="/dashboard/admin/manage-custom-orders/create">
                        <Plus className="h-4 w-4" />
                        Create Custom Order
                    </Link>
                </Button>
            </div>
            <ManageCustomOrdersClient />
        </div>
    );
};

export default ManageCustomOrdersPage;
