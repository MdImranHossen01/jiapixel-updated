"use client";
import React, { useRef, useEffect, useState  } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQItem } from './types';

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);
  return (
    <div className="border-b border-primary-100 last:border-none bg-white first:rounded-t-xl last:rounded-b-xl overflow-hidden transition-colors duration-300 hover:bg-primary-50/30">
      <button
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`font-medium text-lg transition-colors duration-300 ${isOpen ? 'text-primary-700' : 'text-gray-700 group-hover:text-primary-700'}`}>
          {item.question}
        </span>
        <span className={`ml-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? (
            <Minus className="w-5 h-5 text-primary-600" />
          ) : (
            <Plus className="w-5 h-5 text-primary-400 group-hover:text-primary-600" />
          )}
        </span>
      </button>
 <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : '0px',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
};