"use client"

import { Category, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function CategoriesClient({ data }: { data: Category[] }) {
    return (
        <AdminDataTable columns={columns} data={data} searchKey="title" filterKey="isIndexedInGoogle" filterOptions={[{ label: "Indexed", value: "true" }, { label: "Not Indexed", value: "false" }]} />
    )
}
