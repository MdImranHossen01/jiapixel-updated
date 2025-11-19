"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo } from 'react';
import {  HelpCircle } from 'lucide-react';
import { FAQ_DATA } from './constants';
import { FAQCategory } from './types';

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Radix UI Accordion Components
const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b last:border-b-0", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
    {...props}
  >
    <div className={cn("pt-0 pb-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent"

// FAQ Section Component
const FaqSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>(FAQCategory.GENERAL);

  // Filter Logic
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const categories = Object.values(FAQCategory);

  return (
    <section className=" text-foreground max-w-3xl mx-auto py-12">
      {/* Header Section - Fixed with proper spacing and contrast */}
      <div className="container mx-auto px-4 text-center mb-6">
       
        
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-foreground">
          Frequenly Asked <span className='text-primary'>Question</span>
        </h2>
        <p className="text-muted-foreground  mx-auto leading-relaxed">
          Find answers about our web development, SEO, and digital marketing services. 
          Get expert insights on Next.js, React, and driving online success.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="container max-w-3xl mx-auto px-4">
        <div className="rounded-3xl  p-1 md:p-2  mx-auto backdrop-blur-sm">
          
          {/* Search and Filter Bar */}
          <div className="rounded-2xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
              
              
              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-full text-sm font-small whitespace-nowrap transition-all duration-200 border ${
                      selectedCategory === cat
                        ? 'bg-primary text-white hover:bg-primary hover:text-primary-foreground border-primary shadow-lg shadow-primary/25'
                        : 'text-secondary-foreground border-gray-400 hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">No results found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We couldn&apos;t find any FAQs matching &quot;{searchTerm}&quot; in {selectedCategory}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
};

export default FaqSection;