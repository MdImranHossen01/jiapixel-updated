"use client"

import { Service, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function ServicesClient({ data }: { data: Service[] }) {
    return (
        <AdminDataTable columns={columns} data={data} searchKey="title" filterKey="isIndexedInGoogle" filterOptions={[{ label: "Indexed", value: "true" }, { label: "Not Indexed", value: "false" }]} />
    )
}
