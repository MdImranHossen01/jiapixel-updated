"use client";
import { HeroGrid } from './components/HeroGrid';

const Banner: React.FC = () => {
  return (
    <div className="container px-4 mx-auto text-foreground font-sans selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto flex flex-col">
        <div className="flex-1 lg:pt-3 pb-8">
          <HeroGrid />
        </div>
      </div>
    </div>
  );
};

export default Banner;