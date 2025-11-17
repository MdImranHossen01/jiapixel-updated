// src/app/components/Banner.tsx

import { Button } from "@/components/ui/button";

const Banner = () => {
  return (
    // 1. Main container: Relative for positioning, bg-background for theme
    <section className="text-foreground pt-32 pb-20 md:pt-48 md:pb-32 text-center overflow-hidden">
      <div className="container relative z-10 mx-auto px-4">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Boost Your Brands
          <br />
          <span className="text-primary">Creative Vision</span>
        </h1>
        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Join dozens of founders who have doubled their impact with our
          14-day brand redesign. Risk-free, with guaranteed results.
        </p>
        {/* Call to Action Button */}
        <div className="mx-auto w-max">
       <Button variant="default"> Explore Services</Button>
        </div>
      </div>
    </section>
  );
};

export default Banner;