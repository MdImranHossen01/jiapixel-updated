import React from 'react';

interface ServiceStep {
  title: string;
  description: string;
}

interface ServiceStepsProps {
  steps: ServiceStep[];
}

const ServiceSteps = ({ steps }: ServiceStepsProps) => {
  return (
    <section className="bg-card rounded-lg border p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        How It Works
      </h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSteps;