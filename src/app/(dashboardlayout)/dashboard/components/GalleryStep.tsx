/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef } from 'react';
import type { ServiceData } from './ServiceWizard';

interface Props {
  data: ServiceData;
  updateData: (field: keyof ServiceData, value: any) => void;
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

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Create a service gallery</h2>

      {/* Service Images */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Service Images</h3>
        <p className="text-muted-foreground mb-4">
          Upload up to 20 images (.jpg or .png), up to 10MB each and less than 4,000 pixels, in width or height.
        </p>

        {/* File List */}
        {data.images.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Uploaded Images:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {data.images.map((file, index) => {
                const isUrl = typeof file === 'string';
                const previewUrl = isUrl ? file : URL.createObjectURL(file);

                return (
                  <div key={index} className="relative border border-border rounded-lg p-2 group">
                    <div className="aspect-square bg-muted rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={previewUrl}
                        alt={isUrl ? 'Service Image' : file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('images', index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    {!isUrl && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate">
                        {file.name}
                      </div>
                    )}
                  </div>
                );
              })}
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
              {data.documents.map((file, index) => {
                const isUrl = typeof file === 'string';
                const fileName = isUrl ? file.split('/').pop() : file.name;

                return (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 bg-primary/10 rounded flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">PDF</span>
                      </div>
                      <span className="text-foreground text-sm truncate max-w-[200px]" title={fileName}>
                        {fileName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUrl && (
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile('documents', index)}
                        className="text-destructive hover:text-destructive/70 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
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