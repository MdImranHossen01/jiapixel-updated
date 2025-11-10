'use client';

import { useState } from 'react';
import type { ServiceData } from './ServiceWizard';

interface Props {
  data: ServiceData;
  updateData: (field: keyof ServiceData, value: any) => void;
}

export default function RequirementsStep({ data, updateData }: Props) {
  const [newRequirement, setNewRequirement] = useState('');

  const addRequirement = () => {
    if (newRequirement.trim()) {
      updateData('requirements', [...data.requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    updateData('requirements', data.requirements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Requirements for the client</h2>
      
      <div>
        <p className="text-muted-foreground mb-4">
          Tell the client what you need to get started
        </p>
        
        <div className="space-y-3 mb-4">
          {data.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="text-foreground">{index + 1}. {requirement}</span>
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="text-destructive hover:text-destructive/70"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
            placeholder="Add a requirement"
            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
          <button
            type="button"
            onClick={addRequirement}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold text-foreground mb-2">
          Define what you need from your client upfront
        </h3>
        <p className="text-muted-foreground text-sm">
          After a client purchases your service, they will be required to answer questions you define before the contract officially starts.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          The due date for your service is defined by the number of days to deliver, starting from when the client submits.
        </p>
      </div>
    </div>
  );
}