// src/app/components/StepTab.tsx
import React from 'react';

interface Step {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
}

interface StepTabProps {
  step: Step;
  isActive: boolean;
  onClick: () => void;
  isLast: boolean;
}

const StepTab: React.FC<StepTabProps> = ({ step, isActive, onClick, isLast }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full h-full text-left p-6 transition-all duration-300 flex-grow relative 
        overflow-hidden group
        ${!isLast ? 'border-b border-border' : ''}
        ${isActive
          /* FIXED: Changed to horizontal gradient (to-r) */
          ? 'bg-gradient-to-l from-background/90 to-primary/10 text-primary-foreground'
          : 'bg-card hover:bg-card/70'
        }
      `}
      style={{
        flexBasis: 0,
        flexGrow: 1,
      }}
    >
      {/* 1. ACTIVE BORDER BAR */}
      <span
        aria-hidden="true"
        className={`
          absolute top-0 left-0 h-full w-[6px] 
          bg-primary transition-opacity duration-300
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} 
        `}
      />

      <div className="flex flex-col pl-2">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          Step {step.stepNumber}
        </div>
        <h3 className={`text-xl font-bold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-foreground'}`}>
          {step.title}
        </h3>
        <p className={`text-sm mt-2 transition-colors duration-300 ${isActive ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
          {step.description}
        </p>
      </div>
    </button>
  );
};

export default StepTab;