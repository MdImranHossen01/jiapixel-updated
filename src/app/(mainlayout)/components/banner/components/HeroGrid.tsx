import React from "react";
import { ArrowRight, Code } from "lucide-react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion, type Variants } from "framer-motion";

const itemVariants: Variants = {
  // Define the animation variants here
  // For example:
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const HeroGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column Container (Spans 8) */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        {/* Large Hero Image */}
        <div className="relative w-full h-[400px] lg:h-[500px] rounded-4xl overflow-hidden group">
          <Image
            src="https://i.ibb.co.com/yc7g1Rbd/Jia-Pixel-Banner.png"
            alt="Hero Model"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

          <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 max-w-2xl">
            <motion.h2
              className="text-4xl lg:text-6xl pb-4 font-serif text-white leading-tight"
              variants={itemVariants}
            >
              <span className="text-xl">Welcome to Jia Pixel</span><br/>
              Your Partner in Digital <br />Transformation <br />
              <motion.span
                className="text-3xl lg:w-5xl mt-4 text-white font-medium h-10"
                variants={itemVariants}
              >
                <TypeAnimation
                  sequence={[
                    "World Class Web Application Development ",
                    1500,
                    "SEO Optimization to Rank Higher",
                    1500,
                    "Best Deigital Marketing Strategys",
                    1500,
                   
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  style={{ display: "inline-block" }}
                />
              </motion.span>
            </motion.h2>

            
              {/* CTA Buttons */}
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2">
                  <Code size={20} />
                  View Projects
                </button>
                <button className="px-6 py-3 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                  Contact Me
                </button>
              </motion.div>
          </div>
        </div>

        {/* Bottom Left CTA Card */}
        <motion.div 
          className="bg-linear-to-r from-gray-900 to-black rounded-4xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[180px] border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex-1">
            <h3 className="text-white text-xl lg:text-2xl font-bold mb-3">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              Let&apos;s build something amazing together. From concept to deployment, 
              I deliver cutting-edge solutions that drive results.
            </p>
          </div>
          <button className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-linear-to-r from-purple-600 to-blue-500 flex items-center justify-center group hover:scale-105 transition-all duration-300 shrink-0 shadow-lg">
            <ArrowRight size={32} className="text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Right Column Container (Spans 4) */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {/* Card 1 */}
        <div className="relative h-[220px] rounded-4xl overflow-hidden group cursor-pointer">
          <Image
            src="https://i.ibb.co.com/SwQK8Wpf/Login-1.png"
            alt="Free Website"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 filter sepia-[.25]"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm py-3 px-4 rounded-full flex items-center justify-between shadow-lg">
              <span className="text-black font-bold text-sm tracking-wide">
                Free Website
              </span>
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-between">
                <ArrowRight size={14} className="text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative h-[220px] rounded-4xl overflow-hidden group cursor-pointer">
          <Image
            src="https://i.ibb.co.com/846LJDM3/Free-SEO-Audit-Jia-Pixel.jpg"
            alt="Free SEO Audit"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[0.3]"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm py-3 px-4 rounded-full flex items-center justify-between shadow-lg">
              <span className="text-black font-bold text-sm tracking-wide">
                Free SEO Audit
              </span>
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-between">
                <ArrowRight size={14} className="text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative h-[220px] rounded-4xl overflow-hidden group cursor-pointer">
          <Image
            src="https://i.ibb.co.com/XrxRBwy7/Free-Web-Analytics-Setup-Jia-Pixel.jpg"
            alt="Free Analytics Setup"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[0.8] contrast-125"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm py-3 px-4 rounded-full flex items-center justify-between shadow-lg">
              <span className="text-black font-bold text-sm tracking-wide">
                Free Analytics Setup
              </span>
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-between">
                <ArrowRight size={14} className="text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
