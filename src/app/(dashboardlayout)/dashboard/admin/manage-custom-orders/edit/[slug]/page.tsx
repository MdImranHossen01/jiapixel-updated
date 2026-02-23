import EditCustomOrderClient from "./EditCustomOrderClient";

export const metadata = {
    title: "Edit Custom Order | Admin Dashboard",
    description: "Edit an existing custom order proposal.",
};

export default async function EditCustomOrderPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;

    return (
        <div className="p-6">
            <EditCustomOrderClient slug={params.slug} />
        </div>
    );
}
