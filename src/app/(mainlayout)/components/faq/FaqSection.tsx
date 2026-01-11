"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FAQ_DATA } from './constants';
import Lottie from 'lottie-react';
import FAQLottieData from '../../../../../public/Assets/FAQ.json'

gsap.registerPlugin(ScrollTrigger);

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default
  const containerRef = useRef<HTMLElement>(null);
  const faqs = FAQ_DATA.slice(0, 5); // Use first 5 FAQs for display to match design layout

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  useGSAP(() => {
    const statsItems = gsap.utils.toArray<HTMLElement>('.stat-number');

    statsItems.forEach((stat) => {
      const targetValue = parseInt(stat.getAttribute('data-value') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';

      gsap.fromTo(stat,
        { innerText: 0 },
        {
          innerText: targetValue,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          snap: { innerText: 1 },
          onUpdate: function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            stat.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString() + suffix;
          }
        }
      );
    });
  }, { scope: containerRef });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const stats = [
    { number: 1200, suffix: "+", label: "Projects Completed" },
    { number: 50, suffix: "+", label: "Industry Awards" },
    { number: 800, suffix: "+", label: "Global Clients" },
  ];

  return (
    <section ref={containerRef} className="relative w-full bg-background overflow-hidden relative z-10">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>

      <div className="flex flex-col lg:flex-row min-h-[700px] relative">

        {/* Left Content Area: FAQs */}
        <div
          className="w-full lg:w-[65%] px-6 py-16 md:py-24 lg:pl-20 xl:pl-32 lg:pr-48 z-10"
          data-aos="fade-right"
        >
          <div className="max-w-3xl">
            <header className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1]">
                Common <span className="text-primary">Questions</span> & <br className="hidden md:block" />
                Expert Answers
              </h2>
            </header>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`group border rounded-2xl transition-all duration-300 ${openIndex === index
                    ? 'border-primary/20 bg-card shadow-xl shadow-primary/5'
                    : 'border-border bg-muted/50 hover:bg-card hover:border-border'
                    }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 md:py-2 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-primary text-primary-foreground' : 'bg-card text-primary shadow-sm'
                        }`}>
                        {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                      </div>
                      <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${openIndex === index ? 'text-primary' : 'text-foreground'
                        }`}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronRight
                      className={`hidden sm:block w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? 'rotate-90 text-primary' : 'group-hover:translate-x-1'
                        }`}
                    />
                  </button>

                  <div
                    className={`
                        overflow-hidden transition-all duration-500 ease-in-out
                        ${openIndex === index ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
                      `}
                  >
                    <div className="px-6 pb-6 pt-0 ml-14">
                      <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))
              }
            </div>
          </div>
        </div>

        {/* Right Side: Visual Section & Overlapping Images */}
        <div className="hidden lg:flex relative w-full lg:w-[35%] min-h-[500px] lg:min-h-full flex-col">

          {/* Main Blue Block with Stats */}
          <div
            className="w-full h-full bg-primary relative overflow-hidden flex flex-col justify-center p-10 md:p-16 lg:p-20 text-primary-foreground z-0"
            data-aos="fade-left"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/80 to-transparent"></div>
              <svg className="absolute bottom-0 right-0 w-full h-1/2 text-primary-foreground opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
              </svg>
            </div>

            <div className="relative z-10 space-y-12 lg:ml-12 xl:ml-20">
              {stats.map((stat, idx) => (
                <div key={idx} className="group cursor-default">
                  <div
                    className="stat-number text-5xl md:text-6xl font-black tracking-tighter transition-transform group-hover:scale-105 origin-left duration-300"
                    data-value={stat.number}
                    data-suffix={stat.suffix}
                  >
                    0{stat.suffix}
                  </div>
                  <div className="text-primary-foreground/80 font-medium text-lg opacity-80 mt-1 uppercase tracking-widest text-xs">
                    {stat.label}
                  </div>
                  <div className="w-12 h-1 bg-primary-foreground/20 mt-4 rounded-full transition-all group-hover:w-24 group-hover:bg-primary-foreground duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlapping Featured Image (Desktop Only) */}
          <div
            className="hidden lg:block absolute left-[-160px] top-1/2 -translate-y-1/2 z-30 group"
            data-aos="fade-up"
          >
            <div className="relative w-[320px] h-[480px]">
              {/* Image Frame with Shadow & Border */}
              <div className="absolute inset-0 bg-card p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1 overflow-hidden">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Lottie animationData={FAQLottieData} loop={true} />
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center w-28 h-28 border-4 border-primary animate-bounce-slow z-10">
                  <span className="text-3xl font-black text-primary">5+</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase text-center leading-none">Years of Excellence</span>
                </div>
              </div>

              {/* Decorative dotted pattern behind image */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[radial-gradient(hsl(var(--primary))_2px,transparent_2px)] [background-size:16px_16px] opacity-20 -z-10"></div>
            </div>
          </div>


        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}} />
    </section>
  );
};

export default FaqSection;