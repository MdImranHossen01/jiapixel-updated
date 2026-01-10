"use client";

import React from "react";
import { Check } from "lucide-react";
import { PricingCategory, PricingOption } from "@/constants/estimator-data";
import { cn } from "@/lib/utils";

interface StepSelectionProps {
    category: PricingCategory;
    selectedIds: string[];
    onToggle: (id: string, multi: boolean) => void;
}

export const StepSelection: React.FC<StepSelectionProps> = ({
    category,
    selectedIds,
    onToggle,
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.options.map((option) => {
                    const isSelected = selectedIds.includes(option.id);
                    return (
                        <div
                            key={option.id}
                            onClick={() => onToggle(option.id, category.multiSelect || false)}
                            className={cn(
                                "cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 relative",
                                isSelected
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{option.label}</h3>
                                {isSelected && (
                                    <div className="bg-primary text-white rounded-full p-1">
                                        <Check size={14} />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                                {option.description}
                            </p>
                            <div className="font-medium text-primary">
                                {option.price === 0 ? "Free / Included" : `+$${option.price}`}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
