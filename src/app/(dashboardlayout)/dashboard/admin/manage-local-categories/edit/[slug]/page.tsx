"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LocalCategoryForm from '../../components/LocalCategoryForm';

const EditLocalCategoryPage = () => {
    const params = useParams();
    const slug = params.slug as string;
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchCategory(slug);
        }
    }, [slug]);

    const fetchCategory = async (slug: string) => {
        try {
            const res = await fetch(`/api/local-categories/${slug}`);
            const data = await res.json();
            if (res.ok) {
                setCategory(data.category);
            }
        } catch (error) {
            console.error("Failed to fetch category", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!category) return <div>Category not found</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Local Category</h1>
            <LocalCategoryForm initialData={category} isEdit={true} />
        </div>
    );
};

export default EditLocalCategoryPage;
