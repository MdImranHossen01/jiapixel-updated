"use client"

import { Blog, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function BlogsClient({ data }: { data: Blog[] }) {
    return (
        <AdminDataTable columns={columns} data={data} searchKey="title" filterKey="isIndexedInGoogle" filterOptions={[{ label: "Indexed", value: "true" }, { label: "Not Indexed", value: "false" }]} />
    )
}
