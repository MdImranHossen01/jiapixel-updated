"use client";

import React from "react";
import CategoryForm from "../components/CategoryForm";

const CreateCategoryPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Category</h1>
            <CategoryForm />
        </div>
    );
};

export default CreateCategoryPage;
