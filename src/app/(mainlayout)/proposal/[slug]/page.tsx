import ProposalClient from "./ProposalClient";

export const metadata = {
    title: "Review Proposal | JiaPixel",
    description: "Review and accept your custom project proposal.",
};

export default async function ProposalPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <div className="bg-primary pt-24 pb-12 px-4 shadow-sm">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                        Project Proposal
                    </h1>
                    <p className="text-primary-foreground/80 text-lg max-w-2xl">
                        Please review the details, timeline, and scope of your custom order below.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
                <ProposalClient slug={params.slug} />
            </div>
        </div>
    );
}
