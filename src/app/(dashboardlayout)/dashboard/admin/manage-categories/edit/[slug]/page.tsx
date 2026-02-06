"use client";

import React, { useEffect, useState } from "react";
import CategoryForm from "../../components/CategoryForm";
import { toast } from "sonner";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const EditCategoryPage = ({ params }: PageProps) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);


    const [slug, setSlug] = useState<string | null>(null);

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setSlug(resolvedParams.slug);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                // The API /api/categories/[id] handles slugs too.
                const res = await fetch(`/api/categories/${slug}`);
                const result = await res.json();
                if (res.ok) {
                    setData(result);
                } else {
                    toast.error("Failed to fetch category");
                }
            } catch (error) {
                toast.error("An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Category not found</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
            <CategoryForm initialData={data} isEdit />
        </div>
    );
};

export default EditCategoryPage;
