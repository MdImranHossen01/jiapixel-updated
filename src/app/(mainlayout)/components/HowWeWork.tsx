"use client";

import React, { useState } from "react";
import Image from "next/image";
import StepTab from "./StepTab";

const WORK_STEPS = [
  {
    id: "tab1",
    stepNumber: "One",
    title: "Free Audit & Strategic Game Plan",
    description:
      "Book your free website audit with our conversion expert, tailored specifically for startup founders.",
    imageUrl: "/Kimbap.jpg",
  },
  {
    id: "tab2",
    stepNumber: "Two",
    title: "2-Week Design & Build Sprint",
    description:
      "Complete design and Webflow development using our proven conversion framework, while ensuring everything aligns with your vision.",
    imageUrl: "/Tteokbokki.jpg",
  },
  {
    id: "tab3",
    stepNumber: "Three",
    title: "Launch, Optimize, & Grow",
    description:
      "Go live with your new conversion-optimized Webflow website & receive 30 to 90 days of monitoring & optimization to multiply your results.",
    imageUrl: "/Japchae.jpg",
  },
];

const STATS = [
  { number: "25+", label: "Founders & Owners Served" },
  { number: "50+", label: "Websites Completed" },
  { number: "200%+", label: "Avg. Conversion Increase" },
  { number: "$5M+", label: "Clients Revenue Influenced" },
];

const HowWeWork = () => {
  const [activeTab, setActiveTab] = useState(WORK_STEPS[0].id);
  const activeStep =
    WORK_STEPS.find((step) => step.id === activeTab) || WORK_STEPS[0];

  // Calculate the total number of steps
  const totalSteps = WORK_STEPS.length;

  return (
    <section className="bg-background text-foreground py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Headline */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 max-w-4xl mx-auto leading-tight">
          How Our{" "}
          <span className="text-primary">Risk-Free Creative Service</span>{" "}
          Transformation Works
        </h2>

        {/* Tabs Component (Steps + Image) */}
        {/* Use flex to enable equal height stretching and 1/3 and 2/3 widths */}
        <div className="flex flex-col md:flex-row gap-8 mb-20 md:h-[600px]">
          {/* Left Side: Step Menu - Takes 1/3 width and fills the height */}
          {/* Added 'h-full' and 'flex flex-col' for no gap stacking */}
          <div className="md:w-1/3 h-full flex flex-col overflow-hidden rounded-xl border border-border">
            {WORK_STEPS.map((step, index) => (
              <StepTab
                key={step.id}
                step={step}
                isActive={activeTab === step.id}
                onClick={() => setActiveTab(step.id)}
                isLast={index === totalSteps - 1} // Pass prop to remove bottom border
              />
            ))}
          </div>

          {/* Right Side: Image Display - Takes 2/3 width and fills the height */}
          <div className="md:w-2/3 h-full relative min-h-[300px] rounded-xl overflow-hidden shadow-2xl border-2 border-border transition-all duration-300">
            <Image
              src={activeStep.imageUrl}
              alt={activeStep.title}
              fill
              style={{ objectFit: "cover" }}
              className="p-6 rounded-xl transition-opacity duration-300"
              key={activeStep.id}
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-20 border-t border-border pt-8">
          {STATS.map((stat, index) => (
            <Stat key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;

// Stat Component (Used at the bottom)
const Stat = ({ number, label }: { number: string; label: string }) => {
  return (
    <div className="p-2 border-r last:border-r-0 border-border md:border-r md:last:border-r-0">
      <p className="text-3xl md:text-4xl font-extrabold text-primary mb-1">
        {number}
      </p>
      <p className="text-sm md:text-base text-muted-foreground">{label}</p>
    </div>
  );
};