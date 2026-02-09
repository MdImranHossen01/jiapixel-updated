"use client"

import { Project, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function ProjectsClient({ data }: { data: Project[] }) {
    return (
        <AdminDataTable
            columns={columns}
            data={data}
            searchKey="title"
            filterKey="isIndexedInGoogle"
            filterOptions={[
                { label: "Indexed", value: "true" },
                { label: "Not Indexed", value: "false" }
            ]}
        />
    )
}
