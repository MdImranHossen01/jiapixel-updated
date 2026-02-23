"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ESTIMATOR_DATA, PricingCategory } from "@/constants/estimator-data";
import { StepSelection } from "./StepSelection";
import { SummaryStep } from "./SummaryStep";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";

export const EstimatorWizard = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selections, setSelections] = useState<Record<string, string[]>>({});

    const {
        isOpen,
        openModal,
        closeModal,
    } = useAuthModal();

    const visibleCategories = useMemo(() => {
        return ESTIMATOR_DATA.filter((cat) => {
            if (!cat.dependsOn) return true;
            for (const [key, allowedValues] of Object.entries(cat.dependsOn)) {
                const selectedForCat = selections[key] || [];
                const hasIntersection = selectedForCat.some((val) => allowedValues.includes(val));
                if (!hasIntersection) return false;
            }
            return true;
        });
    }, [selections]);

    // Ensure step index is within bounds if categories change
    useEffect(() => {
        if (currentStepIndex > visibleCategories.length) {
            setCurrentStepIndex(visibleCategories.length);
        }
    }, [currentStepIndex, visibleCategories.length]);

    const totalSteps = visibleCategories.length + 1; // Categories + Summary
    const isSummaryStep = currentStepIndex === visibleCategories.length;
    const currentCategory: PricingCategory | undefined = visibleCategories[currentStepIndex];

    // Calculate Total Cost
    const { totalCost, selectedItems } = useMemo(() => {
        let cost = 0;
        const items: { category: string; option: string; price: number; label: string }[] = [];

        visibleCategories.forEach((cat) => {
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
    }, [selections, visibleCategories]);

    const handleSendMessageResponse = async (message: string) => {
        try {
            const usersResponse = await fetch("/api/users?role=admin");
            if (!usersResponse.ok) {
                throw new Error("Failed to fetch admin user");
            }

            const usersData = await usersResponse.json();
            const adminUsers = usersData.users || [];

            if (adminUsers.length === 0) {
                alert("Admin user not found. Please try again later.");
                return;
            }

            const adminUser = adminUsers[0];

            // Append estimator breakdown exactly as the user requested
            const breakdownDetails = selectedItems.map(item => `- ${item.label}: $${item.price}`).join('\n');
            const fullMessage = `${message}\n\n---\nEstimator Selections:\n${breakdownDetails}\nTotal Estimate: $${totalCost}`;

            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    receiverId: adminUser._id,
                    content: fullMessage,
                }),
            });

            if (response.ok) {
                alert("Estimate details sent to admin successfully! They will get back to you soon.");
                closeModal();
            } else {
                alert("Message could not be sent. Please try again later.");
            }
        } catch (error) {
            console.error("Error in handleSendMessage:", error);
            alert("Error processing your request. Please try again.");
        }
    };

    const handleToggle = (optionId: string, multi: boolean) => {
        if (!currentCategory) return;

        setSelections((prev) => {
            const current = prev[currentCategory.id] || [];
            let newSelection;
            if (multi) {
                if (current.includes(optionId)) {
                    newSelection = current.filter((id) => id !== optionId);
                } else {
                    newSelection = [...current, optionId];
                }
            } else {
                // Single select
                newSelection = [optionId];
            }

            // Cleanup invalid selections when a dependency changes
            const updatedSelections = { ...prev, [currentCategory.id]: newSelection };

            // Note: We don't strictly need to clear them out of state because visibleCategories handles it,
            // but for data hygiene, we could stringently wipe them. For now, visibleCategories filtering
            // during totalCost generation is enough and harmless.

            return updatedSelections;
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
                        onSendEstimate={() => openModal(
                            "Project Estimate Inquiry",
                            { title: `Custom Estimate ($${totalCost})`, price: totalCost, description: "Based on estimator selections" },
                            window.location.href
                        )}
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

            <AuthModal
                isOpen={isOpen}
                serviceTitle="Custom Project Estimate"
                selectedTier={null}
                serviceUrl={typeof window !== "undefined" ? window.location.href : ""}
                detailedBreakdown={`Estimator Selections:\n${selectedItems.map(item => `- ${item.label}: $${item.price}`).join('\n')}\nTotal Estimate: $${totalCost}`}
                onClose={closeModal}
                onMessageSend={handleSendMessageResponse}
            />
        </div>
    );
};
