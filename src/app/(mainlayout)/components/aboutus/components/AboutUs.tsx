import React from 'react';
import Image from 'next/image';
import Logo from '../../Logo';

const AboutUs: React.FC = () => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-8 lg:px-16 ">
      <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* --- Row 1 --- */}
        
        {/* Text Column (Spans 2 columns on large screens) */}
        <div className="md:col-span-2 flex flex-col justify-start lg:pt-12">
          <div className="flex items-center text-center lg:text-left mb-8 lg:mb-12">
            
            
            <h1>
              <Logo/> <br/>
              <span className="text-muted-foreground mx-auto text-sm md:text-xl sm:text-base lg:text-2xl lg:uppercase lg:tracking-widest lg:leading-loose max-w-md font-normal"> leading digital agency in Bangladesh, serving all over the world.</span>
            </h1>
          </div>
          
         
        </div>

        {/* Feature 1: Web Development */}
        <div className="lg:col-span-1 h-64 md:h-80 lg:h-[400px] overflow-hidden group relative">
          <Image 
            src="/Assets/aboutus/webpage.webp" 
            alt="Web Development"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex flex-col justify-center p-6">
            <h3 className="text-2xl font-bold text-white mb-3">Web Development</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Custom websites built with modern frameworks for optimal performance
            </p>
          </div>
        </div>

        {/* Feature 2: SEO Services */}
        <div className="lg:col-span-1 h-64 md:h-80 lg:h-[400px] overflow-hidden group relative">
          <Image 
            src="/Assets/aboutus/seograph.webp" 
            alt="SEO Optimization"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex flex-col justify-center p-6">
            <h3 className="text-2xl font-bold text-white mb-3">SEO Optimization</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Boost search rankings with data-driven strategies and analytics
            </p>
          </div>
        </div>

        {/* Feature 3: Digital Marketing */}
        <div className="lg:col-span-1 h-64 md:h-80 lg:h-[400px] overflow-hidden group relative">
          <Image 
            src="/Assets/aboutus/digitalmarketing.webp" 
            alt="Digital Marketing"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex flex-col justify-center p-6">
            <h3 className="text-2xl font-bold text-white mb-3">Digital Marketing</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Targeted campaigns that drive growth and maximize ROI
            </p>
          </div>
        </div>

        {/* --- Row 2 --- */}

        {/* Wide Feature: Full Stack Solutions */}
        <div className="lg:col-span-3 h-64 md:h-80 lg:h-[400px] overflow-hidden group relative">
          <Image 
            src="/Assets/aboutus/FullStackdevelopment.webp" 
            alt="Full Stack Solutions"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex flex-col justify-center p-8">
            <h3 className="text-3xl font-bold text-white mb-4">Full Stack Solutions</h3>
            <p className="text-gray-200 text-base leading-relaxed max-w-2xl">
              End-to-end digital solutions from concept to deployment with cutting-edge technologies
            </p>
          </div>
        </div>

        {/* Feature 5: UI/UX Design */}
        <div className="lg:col-span-1 h-64 md:h-80 lg:h-[400px] overflow-hidden group relative">
          <Image 
            src="/Assets/aboutus/uiuxdesign.webp" 
            alt="UI/UX Design"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex flex-col justify-center p-6">
            <h3 className="text-2xl font-bold text-white mb-3">UI/UX Design</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Intuitive interfaces that enhance user engagement and conversion
            </p>
          </div>
        </div>

        {/* Feature 6: Analytics & Insights */}
        <div className="lg:col-span-1 h-64 md:h-80 lg:h-[400px] overflow-hidden group relative">
          <Image 
            src="/Assets/aboutus/webanalytics.webp" 
            alt="Analytics & Insights"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex flex-col justify-center p-6">
            <h3 className="text-2xl font-bold text-white mb-3">Analytics & Insights</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Data-driven decisions with comprehensive tracking and reporting
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;