"use client";

import React, { useState, useMemo } from "react";
import { ESTIMATOR_DATA, PricingCategory } from "@/constants/estimator-data";
import { StepSelection } from "./StepSelection";
import { SummaryStep } from "./SummaryStep";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const EstimatorWizard = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selections, setSelections] = useState<Record<string, string[]>>({});

    const totalSteps = ESTIMATOR_DATA.length + 1; // Categories + Summary
    const isSummaryStep = currentStepIndex === ESTIMATOR_DATA.length;
    const currentCategory: PricingCategory | undefined = ESTIMATOR_DATA[currentStepIndex];

    // Calculate Total Cost
    const { totalCost, selectedItems } = useMemo(() => {
        let cost = 0;
        const items: { category: string; option: string; price: number; label: string }[] = [];

        ESTIMATOR_DATA.forEach((cat) => {
            const catSelection = selections[cat.id] || [];
            cat.options.forEach((opt) => {
                if (catSelection.includes(opt.id)) {
                    cost += opt.price;
                    items.push({
                        category: cat.title,
                        option: opt.id,
                        price: opt.price,
                        label: opt.label,
                    });
                }
            });
        });

        return { totalCost: cost, selectedItems: items };
    }, [selections]);

    const handleToggle = (optionId: string, multi: boolean) => {
        if (!currentCategory) return;

        setSelections((prev) => {
            const current = prev[currentCategory.id] || [];
            if (multi) {
                if (current.includes(optionId)) {
                    return { ...prev, [currentCategory.id]: current.filter((id) => id !== optionId) };
                } else {
                    return { ...prev, [currentCategory.id]: [...current, optionId] };
                }
            } else {
                // Single select: toggling off is allowed only if optional? No, usually radio behavior for single.
                // Let's enforce 1 selection.
                return { ...prev, [currentCategory.id]: [optionId] };
            }
        });
    };

    const handleNext = () => {
        if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    };

    const handleRestart = () => {
        setSelections({});
        setCurrentStepIndex(0);
    };

    const canProceed = () => {
        if (isSummaryStep) return true;
        // Require at least one selection for single-select categories
        if (!currentCategory?.multiSelect) {
            const current = selections[currentCategory?.id || ""] || [];
            return current.length > 0;
        }
        return true; // Optional for multi-select
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-sm p-6 md:p-10">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
                    <span>Step {currentStepIndex + 1} of {totalSteps}</span>
                    <span>{Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% Completed</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            <div className="min-h-[400px]">
                {isSummaryStep ? (
                    <SummaryStep
                        totalCost={totalCost}
                        selections={selectedItems}
                        onRestart={handleRestart}
                    />
                ) : (
                    currentCategory && (
                        <StepSelection
                            category={currentCategory}
                            selectedIds={selections[currentCategory.id] || []}
                            onToggle={handleToggle}
                        />
                    )
                )}
            </div>

            {/* Footer Navigation */}
            {!isSummaryStep && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStepIndex === 0}
                        className="text-muted-foreground"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!canProceed()}>
                        Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};
