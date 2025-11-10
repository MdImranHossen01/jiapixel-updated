'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import './tiptap.css';

interface TipTapWrapperProps {
  content: string;
  onChange: (content: string) => void;
}

// This component will only render on the client side
function TipTapEditor({ content, onChange }: TipTapWrapperProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const editorConfig = {
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto cursor-pointer transition-all duration-200',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-3',
      },
    },
    immediatelyRender: false,
  };

  const editor = useEditor(editorConfig);

  const fullscreenEditor = useEditor({
    ...editorConfig,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-full p-6',
      },
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    if (fullscreenEditor && content !== fullscreenEditor.getHTML()) {
      fullscreenEditor.commands.setContent(content);
    }
  }, [editor, fullscreenEditor, content]);

  // Image resize and drag functionality
  useEffect(() => {
    if (!editor || !mounted) return;

    const handleImageClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'IMG') {
        setSelectedImage(target);
        event.stopPropagation();
      } else {
        setSelectedImage(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('img')) {
        setSelectedImage(null);
      }
    };

    const editorElement = editor.options.element;
    if (editorElement) {
      editorElement.addEventListener('click', handleImageClick);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('click', handleImageClick);
      }
      document.removeEventListener('click', handleClickOutside);
    };
  }, [editor, mounted]);

  // Image resize functionality
  useEffect(() => {
    if (!selectedImage || !editor) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && selectedImage) {
        const rect = selectedImage.getBoundingClientRect();
        const newWidth = Math.max(100, e.clientX - rect.left);
        selectedImage.style.width = `${newWidth}px`;
        selectedImage.style.height = 'auto';
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, selectedImage, editor]);

  const setLink = () => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const unsetLink = () => {
    editor?.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  // Highlight color functions
  const setHighlight = (color: string = '#fffb0080') => {
    editor?.chain().focus().setHighlight({ color }).run();
    setShowColorPicker(false);
  };

  const removeHighlight = () => {
    editor?.chain().focus().unsetHighlight().run();
    setShowColorPicker(false);
  };

  // Text color functions
  const setTextColor = (color: string = '#000000') => {
    editor?.chain().focus().setColor(color).run();
    setShowTextColorPicker(false);
  };

  const removeTextColor = () => {
    editor?.chain().focus().unsetColor().run();
    setShowTextColorPicker(false);
  };

  // Text alignment functions
  const setTextAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor?.chain().focus().setTextAlign(alignment).run();
  };

  // Image alignment functions
  const setImageAlignment = (alignment: 'left' | 'center' | 'right') => {
    if (selectedImage) {
      // Remove existing alignment classes
      selectedImage.classList.remove('float-left', 'float-right', 'mx-auto', 'block');
      
      switch (alignment) {
        case 'left':
          selectedImage.classList.add('float-left', 'mr-4', 'mb-4');
          break;
        case 'center':
          selectedImage.classList.add('mx-auto', 'block', 'my-4');
          break;
        case 'right':
          selectedImage.classList.add('float-right', 'ml-4', 'mb-4');
          break;
      }
    }
  };

  // Image upload function
  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadImageToImgBB(file);
      
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setShowImageUpload(false);
      setImageUrl('');
      
      event.target.value = '';
    } catch (error: any) {
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const insertImageByUrl = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageUpload(false);
    }
  };

  // Image resize handlers
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  // Fullscreen functions
  const openFullscreen = () => {
    setShowFullscreen(true);
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  const applyFullscreenChanges = () => {
    if (fullscreenEditor && editor) {
      const content = fullscreenEditor.getHTML();
      editor.commands.setContent(content);
      onChange(content);
    }
    setShowFullscreen(false);
  };

  // Function to count text characters (excluding HTML tags)
  const countTextCharacters = (html: string) => {
    if (typeof window === 'undefined') return 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent?.length || 0;
  };

  // Don't render editor until mounted
  if (!mounted) {
    return (
      <div className="border border-border rounded-lg bg-background min-h-[200px] p-3 flex items-center justify-center">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  const renderToolbar = (editor: any, isFullscreen: boolean = false) => (
    <div className={`border-b border-border bg-muted p-3 flex flex-wrap gap-2 ${isFullscreen ? 'sticky top-0 z-10' : ''}`}>
      {/* Text Formatting Buttons */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('strike') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </button>
      </div>

      {/* Text Alignment Buttons */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setTextAlignment('left')}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Align Left"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setTextAlignment('center')}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Align Center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setTextAlignment('right')}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Align Right"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Text Color Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowTextColorPicker(!showTextColorPicker)}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('textStyle') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Text Color"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
            <path d="M12 3v18" />
          </svg>
        </button>

        {/* Text Color Picker Dropdown */}
        {showTextColorPicker && !isFullscreen && (
          <div className="absolute left-0 mt-1 p-3 bg-card border border-border rounded shadow-lg z-20 w-64">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[
                '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
                '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
                '#78716c', '#d6d3d1', '#dc2626', '#ea580c', '#ca8a04',
                '#16a34a', '#2563eb', '#4f46e5', '#7c3aed', '#db2777'
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setTextColor(color)}
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            <div className="mb-3">
              <label className="block text-xs text-foreground mb-1">Custom Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="#000000"
                  onChange={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      setTextColor(color);
                    }
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={removeTextColor}
              className="w-full px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              Remove Color
            </button>
          </div>
        )}
      </div>

      {/* Highlight Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('highlight') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Highlight"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <path d="M11 11l2 2" />
          </svg>
        </button>

        {/* Highlight Color Picker Dropdown */}
        {showColorPicker && !isFullscreen && (
          <div className="absolute left-0 mt-1 p-3 bg-card border border-border rounded shadow-lg z-20 w-64">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[
                '#fffb0080', '#ffa8a880', '#a5d8ff80', '#96f2d780', '#d0bfff80',
                '#ffd8a880', '#ffc9c980', '#b2f2bb80', '#eebefa80', '#a9e34b80'
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setHighlight(color)}
                  className="w-6 h-6 rounded border border-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            <div className="mb-3">
              <label className="block text-xs text-foreground mb-1">Custom Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  onChange={(e) => {
                    const hex = e.target.value;
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    setHighlight(`rgba(${r}, ${g}, ${b}, 0.5)`);
                  }}
                  className="w-8 h-8 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="#FFFFFF"
                  onChange={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      const r = parseInt(color.slice(1, 3), 16);
                      const g = parseInt(color.slice(3, 5), 16);
                      const b = parseInt(color.slice(5, 7), 16);
                      setHighlight(`rgba(${r}, ${g}, ${b}, 0.5)`);
                    }
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={removeHighlight}
              className="w-full px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              Remove Highlight
            </button>
          </div>
        )}
      </div>

      {/* Headings */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('paragraph') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Paragraph"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      {/* Lists */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      {/* Image Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowImageUpload(!showImageUpload)}
          className="p-2 rounded hover:bg-accent"
          title="Insert Image"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>

        {/* Image Upload Dropdown */}
        {showImageUpload && !isFullscreen && (
          <div className="absolute left-0 mt-1 p-3 bg-card border border-border rounded shadow-lg z-20 w-80">
            <h4 className="text-sm font-medium text-foreground mb-3">Insert Image</h4>
            
            <div className="mb-3">
              <label className="block text-xs text-foreground mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-1">Max 10MB. Supported formats: JPG, PNG, GIF, WebP</p>
            </div>

            <div className="mb-3">
              <label className="block text-xs text-foreground mb-2">Or insert from URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
                />
                <button
                  type="button"
                  onClick={insertImageByUrl}
                  disabled={!imageUrl || uploading}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 disabled:opacity-50"
                >
                  Insert
                </button>
              </div>
            </div>

            {uploading && (
              <div className="text-xs text-muted-foreground text-center">
                Uploading image...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Alignment Controls (only when image is selected) */}
      {selectedImage && !isFullscreen && (
        <div className="flex gap-1 border-l border-border pl-2 ml-2">
          <button
            type="button"
            onClick={() => setImageAlignment('left')}
            className="p-2 rounded hover:bg-accent"
            title="Align Image Left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="12" height="18" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setImageAlignment('center')}
            className="p-2 rounded hover:bg-accent"
            title="Align Image Center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="3" width="12" height="18" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setImageAlignment('right')}
            className="p-2 rounded hover:bg-accent"
            title="Align Image Right"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="3" width="12" height="18" rx="1" />
            </svg>
          </button>
        </div>
      )}

      {/* Link */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded hover:bg-accent ${
            editor.isActive('link') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Add Link"
        >
          Link
        </button>

        {/* Link Input */}
        {showLinkInput && !isFullscreen && (
          <div className="absolute left-0 mt-1 p-2 bg-card border border-border rounded shadow-lg z-10 w-64">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full px-2 py-1 border border-border rounded text-sm mb-2 bg-background"
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={setLink}
                className="flex-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={unsetLink}
                className="flex-1 px-2 py-1 bg-destructive text-destructive-foreground rounded text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Button (only in normal mode) */}
      {!isFullscreen && (
        <button
          type="button"
          onClick={openFullscreen}
          className="p-2 rounded hover:bg-accent ml-auto"
          title="Fullscreen Editor"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="border-b border-border bg-card p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Fullscreen Editor</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeFullscreen}
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyFullscreenChanges}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Apply Changes
              </button>
            </div>
          </div>

          {fullscreenEditor && (
            <>
              {renderToolbar(fullscreenEditor, true)}
              <div className="flex-1 overflow-auto">
                <EditorContent editor={fullscreenEditor} />
              </div>
            </>
          )}

          <div className="border-t border-border bg-muted p-3">
            <div className="text-sm text-muted-foreground">
              {countTextCharacters(fullscreenEditor?.getHTML() || '')}/1,200 characters (text only)
            </div>
          </div>
        </div>
      )}

      {/* Normal Editor */}
      <div className="border border-border rounded-lg bg-background relative">
        {editor && renderToolbar(editor)}
        <div className="min-h-[200px] relative">
          <EditorContent editor={editor} />
          
          {/* Image resize handle */}
          {selectedImage && (
            <div
              className="absolute w-3 h-3 bg-primary rounded-full cursor-se-resize z-10 border-2 border-background"
              style={{
                left: `${selectedImage.offsetLeft + selectedImage.offsetWidth - 6}px`,
                top: `${selectedImage.offsetTop + selectedImage.offsetHeight - 6}px`,
              }}
              onMouseDown={startResizing}
            />
          )}
        </div>
        <div className="border-t border-border p-3">
          <div className="text-sm text-muted-foreground">
            {countTextCharacters(content)}/1,200 characters (text only)
          </div>
        </div>
      </div>
    </div>
  );
}

// Main wrapper that handles the dynamic import
export default function TipTapWrapper(props: TipTapWrapperProps) {
  return <TipTapEditor {...props} />;
}