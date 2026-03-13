"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import CategoriesClient from "./CategoriesClient";
import { Plus } from "lucide-react";

interface Category {
    _id: string;
    title: string;
    slug: string;
    createdAt: string;
    isIndexedInGoogle: boolean;
}

const ManageCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (res.ok) {
                setCategories(data);
            } else {
                toast.error("Failed to fetch categories");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Manage Categories</h1>
                <Link
                    href="/dashboard/admin/manage-categories/create"
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Category
                </Link>
            </div>

            <div className="bg-background rounded-lg shadow overflow-hidden">
                <CategoriesClient data={categories} />
            </div>
        </div>
    );
};

export default ManageCategories;
