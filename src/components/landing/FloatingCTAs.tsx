"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/CustomIcons";
import { LandingCheckoutSheet } from "./LandingCheckoutSheet";

export function FloatingCTAs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 400) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    // Initial check
    toggleVisibility();
    
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: 100, x: "-50%", opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
          className="fixed bottom-2 left-1/2 z-50 w-full max-w-fit px-1 md:px-4"
        >
          <div className="bg-background/60 backdrop-blur-2xl border border-primary/20 p-1 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-1.5">
            <LandingCheckoutSheet source="ecommerce-sticky-cta" price={3500}>
              <Button 
                size="sm" 
                className="rounded-full px-4 h-9 text-[10px] md:text-xs font-black shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                অর্ডার রিকোয়েস্ট
              </Button>
            </LandingCheckoutSheet>
            
            <Button 
              asChild 
              variant="secondary" 
              size="sm" 
              className="rounded-full px-3 h-9 text-[10px] md:text-xs font-bold transition-all hover:bg-accent border border-border/50"
            >
              <a href="https://wa.me/8801919011101" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="mr-1.5 h-3.5 w-3.5" />
                হোয়াটসঅ্যাপ
              </a>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
