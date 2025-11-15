// src/app/components/Banner.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui button path
import { BackgroundLines } from "@/components/ui/background-lines";

const Banner = () => {
  return (
    <BackgroundLines>
    {/* // 1. Main container: Relative for positioning, bg-background for theme */}
    <section className="relative  text-foreground pt-32 pb-20 md:pt-48 md:pb-32 text-center overflow-hidden">
      {/* 2. Background Effects (Grid and Gradient) */}
     

      {/* 3. Content: Relative z-10 to sit on top of the background */}
      <div className="container relative z-10 mx-auto px-4">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Boost Your Brands
          <br />
          <span className="text-primary">Creative Vision</span>
        </h1>
        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Join dozens of founders who have doubled their impact with our 14-day
          brand redesign. Risk-free, with guaranteed results.
        </p>
        {/* Call to Action Button */}
        <Button size="lg" asChild>
          <Link href="/contact">Book My Free Audit</Link>
        </Button>
        
       
        {/* Scarcity Text */}
        <p className="text-sm text-muted-foreground mt-4">
          Only 2 slots left for Q4 of 2025
        </p>
      </div>
    </section>
    </BackgroundLines>
  );
};

export default Banner;
