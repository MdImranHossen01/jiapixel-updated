"use client"

import { Portfolio, columns } from "./columns"
import { AdminDataTable } from "../components/AdminDataTable"

export default function PortfoliosClient({ data }: { data: Portfolio[] }) {
    return (
        <AdminDataTable
            columns={columns}
            data={data}
            searchKey="title"
            filters={[
                {
                    key: "isIndexedInGoogle",
                    label: "Google Index",
                    options: [
                        { label: "Indexed", value: "true" },
                        { label: "Not Indexed", value: "false" }
                    ]
                },
                {
                    key: "featured",
                    label: "Featured",
                    options: [
                        { label: "Featured", value: "true" },
                        { label: "Not Featured", value: "false" }
                    ]
                }
            ]}
        />
    )
}
