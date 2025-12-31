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

    // We need to unwrap params since it's a promise in Next.js 15+
    // But this is a client component. 
    // In client components, params passed as props are Promises? 
    // "Page props are optional and can be asynchronous."
    // Let's use React.use() or just UseEffect to unwrap it if needed, 
    // or since this is a "use client" component attached to a page, we receive it.
    // Actually, simply awaiting it inside the component isn't possible directly if it's not an async component.
    // However, the error message from the user earlier "params is a Promise" suggests we treat it as such.

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
