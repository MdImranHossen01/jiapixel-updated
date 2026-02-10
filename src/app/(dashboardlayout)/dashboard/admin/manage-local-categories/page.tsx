import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import LocalCategoriesClient from "./LocalCategoriesClient";
import dbConnect from "@/lib/db";
import LocalCategoryModel from "@/models/LocalCategory";

export const dynamic = 'force-dynamic';

const ManageLocalCategories = async () => {
    await dbConnect();
    const rawCategories = await LocalCategoryModel.find({}).sort({ createdAt: -1 }).lean();

    const categories = rawCategories.map((cat: any) => ({
        _id: cat._id.toString(),
        title: cat.title,
        slug: cat.slug,
        createdAt: cat.createdAt?.toISOString(),
        isIndexedInGoogle: cat.isIndexedInGoogle || false,
    }));

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Local Categories</h1>
                <Link
                    href="/dashboard/admin/manage-local-categories/create"
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Category
                </Link>
            </div>

            <div className="bg-background rounded-lg shadow overflow-hidden">
                <LocalCategoriesClient data={categories} />
            </div>
        </div>
    );
};

export default ManageLocalCategories;
