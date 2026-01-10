import { EstimatorWizard } from "@/components/estimator/EstimatorWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project Cost Estimator | Jia Pixel",
    description: "Get a quick estimate for your web development or digital marketing project.",
};

export default function EstimatePage() {
    return (
        <div className="min-h-screen bg-background py-20 px-4">
            <div className="container mx-auto space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Get an Instant Quote
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Answer a few quick questions to get a rough estimate for your project. No emails required to see the price.
                    </p>
                </div>

                <EstimatorWizard />
            </div>
        </div>
    );
}
