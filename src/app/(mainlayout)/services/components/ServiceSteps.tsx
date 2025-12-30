"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

// --- 1. INTERFACES (Ensure these match your models/Project.ts) ---

interface ProcessStep {
    title: string;
    description: string;
}

// NOTE: Requirements is now passed to the component via the 'requirements' prop.
interface ServiceStepsProps {
    steps: ProcessStep[];
    requirements: string[]; // Added requirements prop here
}


// --- 2. FIXED CONTENT ---

const FIXED_STEPS = [
    {
        number: 1,
        title: "Request for Project",
        detail: "By clicking on Get Started, you are requesting a project with your requirements through message to us. You agree to our Terms of Service and Refund Policy.",
    },
    {
        number: 2,
        title: "Confirming the project and initial video meeting",
        detail: "Ater request for project, I will setup a initial video meeting to understand your requirements and discuss about payment to confirm the project.",
    },
    {
        number: 3,
        title: "After confirming the project, send requirements so we can start the project.",
        detail: "Delivery time starts when we receives requirements from you.",
    },
    {
        number: 5,
        title: "Review the work, and leave your feedback.",
        detail: "After completing the project, you will review the project, request updates if needed any changes and finally leave feedback to Jia Pixel Digital Agency google business profile.",
    },
];


// --- 3. ALPHABETICAL LIST GENERATOR (Reused from previous fix) ---

const renderListAlphabetically = (items: string[], isRequirements: boolean) => (
    <ul className="list-none space-y-2 mt-3">
        {items.map((item, index) => (
            <li
                key={index}
                className={`flex items-start gap-2 ${isRequirements ? 'text-foreground' : 'text-foreground'}`}
            >
                <span className="shrink-0 text-sm font-semibold pt-px w-4">
                    {/* Use lower-case letters (a, b, c...) */}
                    {String.fromCharCode(97 + index)}.
                </span>
                <span className={`flex-1 ${isRequirements ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item}
                </span>
            </li>
        ))}
    </ul>
);


// --- 4. MAIN COMPONENT ---
const ServiceSteps = ({ steps, requirements }: ServiceStepsProps) => {
    // State for toggling the requirements list
    const [showRequirements, setShowRequirements] = useState(false);
    // State for tracking which dynamic steps are expanded
    const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
    const PROCESSING_STEP_NUMBER = 4;

    // Toggle individual step expansion
    const toggleStep = (index: number) => {
        setExpandedSteps(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // Check if a step is expanded
    const isStepExpanded = (index: number) => expandedSteps.includes(index);

    return (
        <section className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">
                Steps for completing your project
            </h2>

            <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20 -z-10"></div>

                {/* --- Step 1: Fixed Step & Collapsible Requirements --- */}
                <div className="flex gap-4 relative">
                    <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold z-10">
                        {FIXED_STEPS[0].number}
                    </div>
                    <div className="flex-1 pb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{FIXED_STEPS[0].title}</h3>
                        <p className="text-muted-foreground mb-3">{FIXED_STEPS[0].detail}</p>

                    </div>
                </div>
                {/* step 2 */}
                <div className="flex gap-4 relative">
                    <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold z-10">
                        {FIXED_STEPS[1].number}
                    </div>
                    <div className="flex-1 pb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{FIXED_STEPS[1].title}</h3>
                        <p className="text-muted-foreground mb-3">{FIXED_STEPS[1].detail}</p>



                    </div>
                </div>
                {/* step 3 */}
                <div className="flex gap-4 relative">
                    <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold z-10">
                        {FIXED_STEPS[2].number}
                    </div>
                    <div className="flex-1 pb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{FIXED_STEPS[2].title}</h3>
                        <p className="text-muted-foreground mb-3">{FIXED_STEPS[2].detail}</p>

                        {/* Collapsible Requirements/Things Needed */}
                        {requirements && requirements.length > 0 && (
                            <div className="bg-foreground/5 dark:bg-card/30 p-4 rounded-lg border border-border/50">
                                <p
                                    className="text-primary font-semibold text-sm cursor-pointer hover:underline"
                                    onClick={() => setShowRequirements(!showRequirements)}
                                >
                                    {showRequirements ? 'Hide requirements' : 'Show requirements'}
                                    {showRequirements ? <ChevronUp className="inline ml-1 w-3 h-3" /> : <ChevronDown className="inline ml-1 w-3 h-3" />}
                                </p>

                                {showRequirements && (
                                    <div className="mt-2 text-sm space-y-2">

                                        {/* --- FIX: Requirements as ABC List (from data) --- */}
                                        {/* This fulfills the user's request to include requirements under the place order step. */}
                                        {renderListAlphabetically(requirements, true)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* --- Step 4: Dynamic Processing Steps (Database Data) --- */}
                <div className="flex gap-4 relative">
                    <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold z-10">
                        {PROCESSING_STEP_NUMBER}
                    </div>
                    <div className="flex-1 pb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            We works on your project following the steps below.
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Steps may very accoording to your project requirements. Revisions may occur after delivery.
                        </p>

                        {/* Dynamic Steps List with Individual Accordion */}
                        <div className="space-y-3">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-foreground/5 dark:bg-card/30 p-4 rounded-lg border border-border/50 cursor-pointer hover:bg-foreground/10 transition-colors"
                                    onClick={() => toggleStep(index)}
                                >
                                    <div className="flex gap-3 items-start">
                                        <CheckCircle className="shrink-0 w-5 h-5 mt-0.5 text-primary" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-foreground pr-2">
                                                    {step.title}
                                                </h4>
                                                {isStepExpanded(index) ? (
                                                    <ChevronUp className="shrink-0 w-3 h-3 text-primary mt-1" />
                                                ) : (
                                                    <ChevronDown className="shrink-0 w-3 h-3 text-primary mt-1" />
                                                )}
                                            </div>
                                            {isStepExpanded(index) && (
                                                <p className="text-muted-foreground text-sm mt-3 pl-0">
                                                    {step.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Step 5: Final Fixed Step --- */}
                <div className="flex gap-4 relative">
                    <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold z-10">
                        {FIXED_STEPS[3].number}
                    </div>
                    <div className="flex-1 pb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{FIXED_STEPS[3].title}</h3>
                        <p className="text-muted-foreground mb-3">{FIXED_STEPS[3].detail}</p>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default ServiceSteps;