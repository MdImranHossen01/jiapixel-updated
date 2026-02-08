/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { ServiceData } from './ServiceWizard';
import NovelEditor from "@/app/components/editor/NovelEditor";

interface Props {
  data: ServiceData;
  updateData: (field: keyof ServiceData, value: any) => void;
}

// Helper to parse description safely
const getInitialDescription = (desc: any) => {
  if (!desc) return undefined;
  if (typeof desc === 'object') return desc;

  try {
    let parsed = JSON.parse(desc);
    // Handle double-stringified JSON
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        // content is a string but not double stringified JSON
      }
    }
    return parsed;
  } catch (e) {
    // If parsing fails, assume it's legacy HTML string or plain text
    return desc;
  }
};



export default function DescriptionStep({ data, updateData }: Props) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Service description</h2>

      {/* Service Summary with NovelEditor */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Service summary *
        </label>
        <p className="text-muted-foreground mb-4">
          Describe what you will deliver and how it benefits the client. This appears at the top of your service page.
          You can use the toolbar to format your text.
        </p>

        <div className="border border-border rounded-lg overflow-hidden bg-background">
          <NovelEditor
            initialValue={getInitialDescription(data.projectSummary)}
            onChange={(val) => updateData('projectSummary', JSON.stringify(val))}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-muted-foreground">
            {data.projectSummary ? 'Content saved' : 'Content will be automatically saved'}
          </p>
        </div>

        {!data.projectSummary && (
          <p className="text-destructive text-sm mt-2">
            Service summary is required. Please add content above.
          </p>
        )}
      </div>
    </div>
  );
}