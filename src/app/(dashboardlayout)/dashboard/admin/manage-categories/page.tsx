"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Category {
    _id: string;
    title: string;
    slug: string;
    createdAt: string;
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Category deleted successfully");
                setCategories(categories.filter((cat) => cat._id !== id));
            } else {
                toast.error("Failed to delete category");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
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
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="px-6 py-3 text-gray-500 font-medium">Title</TableHead>
                            <TableHead className="px-6 py-3 text-gray-500 font-medium">Slug</TableHead>
                            <TableHead className="px-6 py-3 text-gray-500 font-medium">Created At</TableHead>
                            <TableHead className="px-6 py-3 text-gray-500 font-medium text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id} className="hover:bg-gray-50">
                                <TableCell className="px-6 py-4 text-foreground font-medium">
                                    <Link href={`/${category.slug}`} target="_blank" className="hover:underline hover:text-primary">
                                        {category.title}
                                    </Link>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-foreground">{category.slug}</TableCell>
                                <TableCell className="px-6 py-4 text-foreground">
                                    {new Date(category.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/admin/manage-categories/edit/${category.slug}`}
                                            className="text-blue-500 hover:bg-blue-50 p-2 rounded"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No categories found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ManageCategories;
