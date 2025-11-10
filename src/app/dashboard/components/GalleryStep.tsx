'use client';

import { useRef } from 'react';
import type { ProjectData } from './ProjectWizard';

interface Props {
  data: ProjectData;
  updateData: (field: keyof ProjectData, value: any) => void;
}

export default function GalleryStep({ data, updateData }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList, type: 'images' | 'documents') => {
    const fileArray = Array.from(files);
    updateData(type, [...data[type], ...fileArray]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'images' | 'documents') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (type: 'images' | 'documents', index: number) => {
    const updatedFiles = data[type].filter((_, i) => i !== index);
    updateData(type, updatedFiles);
  };

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Create a project gallery</h2>
      
      {/* Project Images */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Images</h3>
        <p className="text-muted-foreground mb-4">
          Upload up to 20 images (.jpg or .png), up to 10MB each and less than 4,000 pixels, in width or height.
        </p>
        
        {/* File List */}
        {data.images.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Uploaded Images:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {data.images.map((file, index) => (
                <div key={index} className="relative border border-border rounded-lg p-2">
                  <div className="aspect-square bg-muted rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground text-center">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('images', index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
          onDrop={(e) => handleDrop(e, 'images')}
          onDragOver={handleDragOver}
          onClick={() => triggerFileInput(imageInputRef)}
        >
          <p className="text-muted-foreground mb-2">Drag images here or click to browse</p>
          <p className="text-sm text-muted-foreground">
            {data.images.length}/20 images uploaded
          </p>
        </div>
        <input
          type="file"
          ref={imageInputRef}
          multiple
          accept=".jpg,.jpeg,.png"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'images')}
          className="hidden"
        />
      </div>

      {/* Sample Documents */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Sample Documents (optional)</h3>
        <p className="text-muted-foreground mb-4">
          Add up to 2 PDF files that are less than 2 MB each. Clients will only see the first 3 pages of your file.
        </p>

        {/* Document List */}
        {data.documents.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Uploaded Documents:</h4>
            <div className="space-y-2">
              {data.documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">PDF</span>
                    </div>
                    <span className="text-foreground text-sm">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('documents', index)}
                    className="text-destructive hover:text-destructive/70"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
          onDrop={(e) => handleDrop(e, 'documents')}
          onDragOver={handleDragOver}
          onClick={() => triggerFileInput(documentInputRef)}
        >
          <p className="text-muted-foreground">Drag document here or click to browse</p>
          <p className="text-sm text-muted-foreground mt-2">
            {data.documents.length}/2 documents uploaded
          </p>
        </div>
        <input
          type="file"
          ref={documentInputRef}
          multiple
          accept=".pdf"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'documents')}
          className="hidden"
        />
      </div>
    </div>
  );
}