"use client";
import { HeroGrid } from './components/HeroGrid';

const Banner: React.FC = () => {
  return (
    <div className=" text-foreground font-sans selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto flex flex-col">
        <div className="flex-1 px-4 pb-8 pt-4 md:px-6 lg:px-12">
          <HeroGrid />
        </div>
      </div>
    </div>
  );
};

export default Banner;