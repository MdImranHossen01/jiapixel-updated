"use client"

import { LocalCategory, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function LocalCategoriesClient({ data }: { data: LocalCategory[] }) {
    return (
        <AdminDataTable columns={columns} data={data} searchKey="title" filterKey="isIndexedInGoogle" filterOptions={[{ label: "Indexed", value: "true" }, { label: "Not Indexed", value: "false" }]} />
    )
}
