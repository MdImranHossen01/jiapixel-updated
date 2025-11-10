'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { ProjectData, FAQ } from './ProjectWizard';

// Dynamically import the editor wrapper to avoid SSR
const TipTapWrapper = dynamic(() => import('./TipTapWrapper'), {
  ssr: false,
  loading: () => (
    <div className="border border-border rounded-lg bg-background min-h-[200px] p-3 flex items-center justify-center">
      <div className="text-muted-foreground">Loading editor...</div>
    </div>
  )
});

interface Props {
  data: ProjectData;
  updateData: (field: keyof ProjectData, value: any) => void;
}

export default function DescriptionStep({ data, updateData }: Props) {
  const [newFAQ, setNewFAQ] = useState<FAQ>({ question: '', answer: '' });
  const [newStep, setNewStep] = useState('');

  const addFAQ = () => {
    if (newFAQ.question.trim() && newFAQ.answer.trim()) {
      updateData('faqs', [...data.faqs, { ...newFAQ }]);
      setNewFAQ({ question: '', answer: '' });
    }
  };

  const removeFAQ = (index: number) => {
    updateData('faqs', data.faqs.filter((_, i) => i !== index));
  };

  const addProjectStep = () => {
    if (newStep.trim()) {
      updateData('projectSteps', [...data.projectSteps, newStep.trim()]);
      setNewStep('');
    }
  };

  const removeProjectStep = (index: number) => {
    updateData('projectSteps', data.projectSteps.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const steps = [...data.projectSteps];
    if (direction === 'up' && index > 0) {
      [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
      updateData('projectSteps', steps);
    } else if (direction === 'down' && index < steps.length - 1) {
      [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
      updateData('projectSteps', steps);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Project description</h2>

      {/* Project Summary with TipTap Editor */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Project summary
        </label>
        <p className="text-muted-foreground mb-4">
          Describe what you will deliver and how it benefits the client. This appears at the top of your project page.
          You can use the toolbar to format your text.
        </p>
        
        <TipTapWrapper 
          content={data.projectSummary} 
          onChange={(content) => updateData('projectSummary', content)} 
        />
      </div>

      {/* Rest of your component remains exactly the same */}
      {/* Project Steps */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Project steps
        </label>
        <p className="text-muted-foreground mb-4">
          Break down your project into clear, actionable steps.
        </p>
        
        <div className="space-y-3 mb-4">
          {data.projectSteps.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No project steps added yet. Add your first step below.
            </p>
          ) : (
            data.projectSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                <div className="flex flex-col gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === data.projectSteps.length - 1}
                    className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex-1">
                  <span className="text-foreground">{index + 1}. {step}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeProjectStep(index)}
                  className="text-destructive hover:text-destructive/70 mt-1"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProjectStep())}
            placeholder="Add a project step"
            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
          <button
            type="button"
            onClick={addProjectStep}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add Step
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Frequently asked questions
        </label>
        <p className="text-muted-foreground mb-4">
          Add common questions and answers about your project.
        </p>

        {data.faqs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No FAQs added yet. Add your first FAQ below.
          </p>
        ) : (
          <div className="space-y-6 mb-6">
            {data.faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-foreground">Q: {faq.question}</h4>
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-destructive hover:text-destructive/70"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-muted-foreground">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        <div className="border border-border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Question
            </label>
            <input
              type="text"
              value={newFAQ.question}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter a question"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Answer
            </label>
            <textarea
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
              rows={3}
              placeholder="Enter the answer"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
            />
          </div>
          <button
            type="button"
            onClick={addFAQ}
            disabled={!newFAQ.question.trim() || !newFAQ.answer.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add FAQ
          </button>
        </div>
      </div>
    </div>
  );
}