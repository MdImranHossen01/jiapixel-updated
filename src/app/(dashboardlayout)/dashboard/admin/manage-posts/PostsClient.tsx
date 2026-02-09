"use client"

import { Post, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function PostsClient({ data }: { data: Post[] }) {
    return (
        <AdminDataTable columns={columns} data={data} searchKey="title" filterKey="isIndexedInGoogle" filterOptions={[{ label: "Indexed", value: "true" }, { label: "Not Indexed", value: "false" }]} />
    )
}
