"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking-provider";
import { ArrowRight, RefreshCcw } from "lucide-react";

interface SummaryStepProps {
    totalCost: number;
    selections: { category: string; option: string; price: number; label: string }[];
    onRestart: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ totalCost, selections, onRestart }) => {
    const { openBooking } = useBooking();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Estimated Project Cost</h2>
                <div className="text-5xl font-extrabold text-primary">
                    ${totalCost.toLocaleString()}
                    <span className="text-lg text-muted-foreground font-normal ml-2">*approx</span>
                </div>
                <p className="text-muted-foreground max-w-md mx-auto">
                    This is a rough estimate based on your selections. The final cost may vary depending on specific requirements.
                </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 border border-border max-w-2xl mx-auto">
                <h3 className="font-semibold mb-4">Breakdown:</h3>
                <ul className="space-y-3">
                    {selections.map((item, index) => (
                        <li key={index} className="flex justify-between text-sm">
                            <span className="text-foreground/80">{item.label}</span>
                            <span className="font-medium">
                                {item.price === 0 ? "Included" : `$${item.price}`}
                            </span>
                        </li>
                    ))}
                    <li className="flex justify-between text-base font-bold pt-4 border-t border-border mt-4">
                        <span>Total Estimated</span>
                        <span>${totalCost.toLocaleString()}</span>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={openBooking} size="lg" className="gap-2">
                    Book a Consultation <ArrowRight size={18} />
                </Button>
                <Button variant="outline" onClick={onRestart} size="lg" className="gap-2">
                    Start Over <RefreshCcw size={18} />
                </Button>
            </div>
        </div>
    );
};
