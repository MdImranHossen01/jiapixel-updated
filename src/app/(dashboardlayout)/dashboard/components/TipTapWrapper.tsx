/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
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

// Create a custom Color extension that prevents white text colors
const CustomColor = Color.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element: HTMLElement): string | null => element.getAttribute('data-color') || element.style.color || null,
        renderHTML: (attributes: { color?: string }): Record<string, string> => {
          if (!attributes.color) {
            return {};
          }

          const color = attributes.color.toLowerCase();
          if (color === '#ffffff' || color === 'rgb(255, 255, 255)' || color === 'white') {
            return {
              'data-color': color,
              'class': 'text-foreground'
            };
          }

          return {
            style: `color: ${attributes.color}`,
            'data-color': attributes.color
          };
        },
      },
    }
  },
})

// Custom Image extension with resize and alignment support
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => {
          return element.style.width || element.getAttribute('width');
        },
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return {
            style: `width: ${attributes.width}`
          };
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          return element.style.height || element.getAttribute('height');
        },
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return {
            style: `height: ${attributes.height}`
          };
        },
      },
      align: {
        default: 'left',
        parseHTML: element => element.getAttribute('data-align') || 'left',
        renderHTML: attributes => {
          if (!attributes.align || attributes.align === 'left') return {};
          return {
            'data-align': attributes.align,
            'class': `image-align-${attributes.align}`
          };
        },
      },
    };
  },
});

function TipTapEditor({ content, onChange }: TipTapWrapperProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [codeContent, setCodeContent] = useState(content);
  const [fullscreenLinkUrl, setFullscreenLinkUrl] = useState('');
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState('');
  const [showFullscreenLinkInput, setShowFullscreenLinkInput] = useState(false);
  const [showFullscreenImageUpload, setShowFullscreenImageUpload] = useState(false);
  const [showFullscreenColorPicker, setShowFullscreenColorPicker] = useState(false);
  const [showFullscreenTextColorPicker, setShowFullscreenTextColorPicker] = useState(false);

  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

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
      CustomColor.configure({
        types: ['textStyle'],
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg h-auto cursor-pointer transition-all duration-200 resize-image',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setCodeContent(html);
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

  // Clean existing content from white text colors when component mounts
  useEffect(() => {
    if (editor && content) {
      const cleanedContent = content
        .replace(/style="color:\s*rgb\(255,\s*255,\s*255\);?"/gi, 'class="text-foreground"')
        .replace(/style="color:\s*#ffffff;?"/gi, 'class="text-foreground"')
        .replace(/style="color:\s*white;?"/gi, 'class="text-foreground"');
      
      if (cleanedContent !== content) {
        editor.commands.setContent(cleanedContent);
        onChange(cleanedContent);
        setCodeContent(cleanedContent);
      }
    }
  }, [editor, content, onChange]);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setCodeContent(content);
    }
    if (fullscreenEditor && content !== fullscreenEditor.getHTML()) {
      fullscreenEditor.commands.setContent(content);
    }
  }, [editor, fullscreenEditor, content]);

  // Image selection and resize functionality
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
      if (!target.closest('img') && !target.closest('.resize-handle')) {
        setSelectedImage(null);
      }
    };

    const editorElement = editor.options.element;
    const isValidElement = editorElement instanceof HTMLElement;
    
    if (isValidElement) {
      editorElement.addEventListener('click', handleImageClick);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (isValidElement) {
        (editorElement as HTMLElement).removeEventListener('click', handleImageClick);
      }
      document.removeEventListener('click', handleClickOutside);
    };
  }, [editor, mounted]);

  // Global resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && selectedImage) {
        const deltaX = e.clientX - resizeStartX.current;
        const newWidth = Math.max(100, resizeStartWidth.current + deltaX);
        
        // Update the image style
        selectedImage.style.width = `${newWidth}px`;
        selectedImage.style.height = 'auto';
        
        // Also update the actual image attributes in the editor
        if (editor && selectedImage.getAttribute('src')) {
          const transaction = editor.state.tr;
          
          // Find the image node position and update its attributes
          editor.state.doc.descendants((node, position) => {
            if (node.type.name === 'image' && node.attrs.src === selectedImage.getAttribute('src')) {
              transaction.setNodeMarkup(position, undefined, {
                ...node.attrs,
                width: `${newWidth}px`
              });
            }
          });
          
          editor.view.dispatch(transaction);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, selectedImage, editor]);

  // Start resizing
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selectedImage) {
      setIsResizing(true);
      resizeStartX.current = e.clientX;
      resizeStartWidth.current = selectedImage.offsetWidth;
      
      // Add resizing class for visual feedback
      selectedImage.classList.add('resizing');
    }
  };

  // Stop resizing
  useEffect(() => {
    if (!isResizing && selectedImage) {
      selectedImage.classList.remove('resizing');
    }
  }, [isResizing, selectedImage]);

  // Fixed Image alignment function
 // Fixed Image alignment function
const setImageAlignment = (alignment: 'left' | 'center' | 'right') => {
  if (!editor || !selectedImage) return;

  const { view } = editor;
  const { state } = view;
  const { doc, schema } = state;
  
  let imagePos = -1;
  let currentNode: any = null;
  
  // Find the image node with proper typing
  doc.descendants((node: any, pos) => {
    if (node.type.name === 'image' && node.attrs.src === selectedImage.getAttribute('src')) {
      imagePos = pos;
      currentNode = node;
      return false;
    }
  });
  
  if (imagePos === -1 || !currentNode) return;
  
  const transaction = state.tr;
  transaction.setNodeMarkup(imagePos, undefined, {
    ...currentNode.attrs,
    align: alignment
  });
  
  view.dispatch(transaction);
};
  // Link functions for main editor
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

  // Link functions for fullscreen editor
  const setFullscreenLink = () => {
    if (fullscreenLinkUrl && fullscreenEditor) {
      fullscreenEditor.chain().focus().extendMarkRange('link').setLink({ href: fullscreenLinkUrl }).run();
      setFullscreenLinkUrl('');
      setShowFullscreenLinkInput(false);
    }
  };

  const unsetFullscreenLink = () => {
    fullscreenEditor?.chain().focus().unsetLink().run();
    setShowFullscreenLinkInput(false);
  };

  // Highlight color functions for main editor
  const setHighlight = (color: string = '#fffb0080') => {
    editor?.chain().focus().setHighlight({ color }).run();
    setShowColorPicker(false);
  };

  const removeHighlight = () => {
    editor?.chain().focus().unsetHighlight().run();
    setShowColorPicker(false);
  };

  // Highlight color functions for fullscreen editor
  const setFullscreenHighlight = (color: string = '#fffb0080') => {
    fullscreenEditor?.chain().focus().setHighlight({ color }).run();
    setShowFullscreenColorPicker(false);
  };

  const removeFullscreenHighlight = () => {
    fullscreenEditor?.chain().focus().unsetHighlight().run();
    setShowFullscreenColorPicker(false);
  };

  // Text color functions - prevent white colors for main editor
  const setTextColor = (color: string = '#000000') => {
    // Prevent setting white color
    if (color.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white') {
      color = '#000000'; // Fallback to black
    }
    editor?.chain().focus().setColor(color).run();
    setShowTextColorPicker(false);
  };

  const removeTextColor = () => {
    editor?.chain().focus().unsetColor().run();
    setShowTextColorPicker(false);
  };

  // Text color functions for fullscreen editor
  const setFullscreenTextColor = (color: string = '#000000') => {
    // Prevent setting white color
    if (color.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white') {
      color = '#000000'; // Fallback to black
    }
    fullscreenEditor?.chain().focus().setColor(color).run();
    setShowFullscreenTextColorPicker(false);
  };

  const removeFullscreenTextColor = () => {
    fullscreenEditor?.chain().focus().unsetColor().run();
    setShowFullscreenTextColorPicker(false);
  };

  // Text alignment functions for both editors
  const setTextAlignment = (alignment: 'left' | 'center' | 'right' | 'justify', isFullscreen: boolean = false) => {
    if (isFullscreen) {
      fullscreenEditor?.chain().focus().setTextAlign(alignment).run();
    } else {
      editor?.chain().focus().setTextAlign(alignment).run();
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, isFullscreen: boolean = false) => {
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
      
      if (isFullscreen) {
        fullscreenEditor?.chain().focus().setImage({ src: imageUrl }).run();
        setShowFullscreenImageUpload(false);
        setFullscreenImageUrl('');
      } else {
        editor?.chain().focus().setImage({ src: imageUrl }).run();
        setShowImageUpload(false);
        setImageUrl('');
      }
      
      event.target.value = '';
    } catch (error: any) {
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const insertImageByUrl = (isFullscreen: boolean = false) => {
    if (isFullscreen) {
      if (fullscreenImageUrl) {
        fullscreenEditor?.chain().focus().setImage({ src: fullscreenImageUrl }).run();
        setFullscreenImageUrl('');
        setShowFullscreenImageUpload(false);
      }
    } else {
      if (imageUrl) {
        editor?.chain().focus().setImage({ src: imageUrl }).run();
        setImageUrl('');
        setShowImageUpload(false);
      }
    }
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
      setCodeContent(content);
    }
    setShowFullscreen(false);
  };

  // Code preview functions
  const openCodePreview = (isFullscreen: boolean = false) => {
    if (isFullscreen) {
      setCodeContent(fullscreenEditor?.getHTML() || content);
    } else {
      setCodeContent(editor?.getHTML() || content);
    }
    setShowCodePreview(true);
  };

  const closeCodePreview = () => {
    setShowCodePreview(false);
  };

  const applyCodeChanges = () => {
    if (editor && fullscreenEditor) {
      editor.commands.setContent(codeContent);
      fullscreenEditor.commands.setContent(codeContent);
      onChange(codeContent);
    }
    setShowCodePreview(false);
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

  const renderToolbar = (currentEditor: any, isFullscreen: boolean = false) => (
    <div className={`border-b border-border bg-muted p-3 flex flex-wrap gap-2 ${isFullscreen ? 'sticky top-0 z-10' : ''}`}>
      {/* Text Formatting Buttons */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('strike') ? 'bg-accent text-accent-foreground' : ''
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
          onClick={() => setTextAlignment('left', isFullscreen)}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive({ textAlign: 'left' }) ? 'bg-accent text-accent-foreground' : ''
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
          onClick={() => setTextAlignment('center', isFullscreen)}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive({ textAlign: 'center' }) ? 'bg-accent text-accent-foreground' : ''
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
          onClick={() => setTextAlignment('right', isFullscreen)}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive({ textAlign: 'right' }) ? 'bg-accent text-accent-foreground' : ''
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
          onClick={() => isFullscreen ? setShowFullscreenTextColorPicker(!showFullscreenTextColorPicker) : setShowTextColorPicker(!showTextColorPicker)}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('textStyle') ? 'bg-accent text-accent-foreground' : ''
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
        {((isFullscreen && showFullscreenTextColorPicker) || (!isFullscreen && showTextColorPicker)) && (
          <div className="absolute left-0 mt-1 p-3 bg-card border border-border rounded shadow-lg z-20 w-64">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[
                '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e',
                '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#78716c',
                '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb',
                '#4f46e5', '#7c3aed', '#db2777', '#57534e', '#44403c' 
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => isFullscreen ? setFullscreenTextColor(color) : setTextColor(color)}
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
                  onChange={(e) => isFullscreen ? setFullscreenTextColor(e.target.value) : setTextColor(e.target.value)}
                  className="w-8 h-8 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="#000000"
                  onChange={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      isFullscreen ? setFullscreenTextColor(color) : setTextColor(color);
                    }
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={isFullscreen ? removeFullscreenTextColor : removeTextColor}
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
          onClick={() => isFullscreen ? setShowFullscreenColorPicker(!showFullscreenColorPicker) : setShowColorPicker(!showColorPicker)}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('highlight') ? 'bg-accent text-accent-foreground' : ''
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
        {((isFullscreen && showFullscreenColorPicker) || (!isFullscreen && showColorPicker)) && (
          <div className="absolute left-0 mt-1 p-3 bg-card border border-border rounded shadow-lg z-20 w-64">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[
                '#fffb0080', '#ffa8a880', '#a5d8ff80', '#96f2d780', '#d0bfff80',
                '#ffd8a880', '#ffc9c980', '#b2f2bb80', '#eebefa80', '#a9e34b80'
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => isFullscreen ? setFullscreenHighlight(color) : setHighlight(color)}
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
                    const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
                    isFullscreen ? setFullscreenHighlight(rgbaColor) : setHighlight(rgbaColor);
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
                      const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
                      isFullscreen ? setFullscreenHighlight(rgbaColor) : setHighlight(rgbaColor);
                    }
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={isFullscreen ? removeFullscreenHighlight : removeHighlight}
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
          onClick={() => currentEditor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('paragraph') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Paragraph"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''
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
          onClick={() => currentEditor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''
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
          onClick={() => isFullscreen ? setShowFullscreenImageUpload(!showFullscreenImageUpload) : setShowImageUpload(!showImageUpload)}
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
        {((isFullscreen && showFullscreenImageUpload) || (!isFullscreen && showImageUpload)) && (
          <div className="absolute left-0 mt-1 p-3 bg-card border border-border rounded shadow-lg z-20 w-80">
            <h4 className="text-sm font-medium text-foreground mb-3">Insert Image</h4>
            
            <div className="mb-3">
              <label className="block text-xs text-foreground mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, isFullscreen)}
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
                  value={isFullscreen ? fullscreenImageUrl : imageUrl}
                  onChange={(e) => isFullscreen ? setFullscreenImageUrl(e.target.value) : setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
                />
                <button
                  type="button"
                  onClick={() => insertImageByUrl(isFullscreen)}
                  disabled={isFullscreen ? !fullscreenImageUrl || uploading : !imageUrl || uploading}
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

      {/* Image Alignment Controls (only when image is selected and not in fullscreen) */}
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
          onClick={() => isFullscreen ? setShowFullscreenLinkInput(!showFullscreenLinkInput) : setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded hover:bg-accent ${
            currentEditor.isActive('link') ? 'bg-accent text-accent-foreground' : ''
          }`}
          title="Add Link"
        >
          Link
        </button>

        {/* Link Input */}
        {((isFullscreen && showFullscreenLinkInput) || (!isFullscreen && showLinkInput)) && (
          <div className="absolute left-0 mt-1 p-2 bg-card border border-border rounded shadow-lg z-10 w-64">
            <input
              type="url"
              value={isFullscreen ? fullscreenLinkUrl : linkUrl}
              onChange={(e) => isFullscreen ? setFullscreenLinkUrl(e.target.value) : setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full px-2 py-1 border border-border rounded text-sm mb-2 bg-background"
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={isFullscreen ? setFullscreenLink : setLink}
                className="flex-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={isFullscreen ? unsetFullscreenLink : unsetLink}
                className="flex-1 px-2 py-1 bg-destructive text-destructive-foreground rounded text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Code Preview Button */}
      <button
        type="button"
        onClick={() => openCodePreview(isFullscreen)}
        className="p-2 rounded hover:bg-accent"
        title="Code Preview"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </button>

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

      {/* Code Preview Modal */}
      {showCodePreview && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="border-b border-border bg-card p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Code Preview</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeCodePreview}
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCodeChanges}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Apply Changes
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              className="w-full h-full font-mono text-sm p-4 border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck={false}
              placeholder="Enter your HTML code here..."
            />
          </div>

          <div className="border-t border-border bg-muted p-3">
            <div className="text-sm text-muted-foreground">
              Edit the HTML code directly. Click &quot;Apply Changes&quot; to update the editor.
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
              className="absolute w-4 h-4 bg-primary rounded-full cursor-se-resize z-10 border-2 border-background shadow-lg resize-handle"
              style={{
                left: `${selectedImage.offsetLeft + selectedImage.offsetWidth - 8}px`,
                top: `${selectedImage.offsetTop + selectedImage.offsetHeight - 8}px`,
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

      <style jsx>{`
        .resize-image {
          position: relative;
        }
        .resize-image.resizing {
          opacity: 0.8;
        }
        .resize-handle {
          pointer-events: all;
        }
        .resize-handle:hover {
          background-color: #3b82f6;
          transform: scale(1.2);
        }
        .image-align-left {
          display: block;
          margin-right: auto;
        }
        .image-align-center {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .image-align-right {
          display: block;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
}

// Main wrapper that handles the dynamic import
export default function TipTapWrapper(props: TipTapWrapperProps) {
  return <TipTapEditor {...props} />;
}