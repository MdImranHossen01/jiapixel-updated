"use client"

import { Writing, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function WritingsClient({ data }: { data: Writing[] }) {
    return (
        <AdminDataTable columns={columns} data={data} searchKey="title" filterKey="isIndexedInGoogle" filterOptions={[{ label: "Indexed", value: "true" }, { label: "Not Indexed", value: "false" }]} />
    )
}
