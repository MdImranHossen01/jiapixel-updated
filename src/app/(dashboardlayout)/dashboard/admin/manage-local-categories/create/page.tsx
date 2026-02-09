import React from 'react';
import LocalCategoryForm from '../components/LocalCategoryForm';

export const metadata = {
    title: 'Create Local Category | Jiapixel',
    description: 'Create a new local category for projects',
};

const CreateLocalCategoryPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create Local Category</h1>
            <LocalCategoryForm />
        </div>
    );
};

export default CreateLocalCategoryPage;
