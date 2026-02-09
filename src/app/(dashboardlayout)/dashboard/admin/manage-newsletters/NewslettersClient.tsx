"use client"

import { Newsletter, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function NewslettersClient({ data }: { data: Newsletter[] }) {
    return (
        <AdminDataTable columns={columns} data={data} searchKey="title" filterKey="isIndexedInGoogle" filterOptions={[{ label: "Indexed", value: "true" }, { label: "Not Indexed", value: "false" }]} />
    )
}
