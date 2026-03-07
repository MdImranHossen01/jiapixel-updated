import React from "react";
import { ArrowRight, Code } from "lucide-react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion, type Variants } from "framer-motion";
import { useFreeServiceModal } from "@/hooks/useFreeServiceModal";
import FreeServiceModal from "./FreeServiceModal";
import Link from "next/link";
import { useBooking } from "@/components/booking-provider";

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const HeroGrid: React.FC = () => {
  const { isOpen, serviceTitle, serviceType, openModal, closeModal } =
    useFreeServiceModal();
  const { openBooking } = useBooking();

  const handleSendMessage = async (message: string) => {
    try {
      // Send message to admin
      const usersResponse = await fetch("/api/users?role=admin");
      if (!usersResponse.ok) {
        throw new Error("Failed to fetch admin user");
      }

      const usersData = await usersResponse.json();
      const adminUsers = usersData.users || [];

      if (adminUsers.length === 0) {
        alert("Admin user not found. Please try again later.");
        return;
      }

      const adminUser = adminUsers[0];

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: adminUser._id,
          content: message,
        }),
      });

      if (response.ok) {
        alert(
          "Message sent to admin successfully! They will get back to you soon."
        );
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      alert("Error processing your request. Please try again.");
    }
  };

  const handleFreeServiceClick = (serviceType: string) => {
    let title = "";

    switch (serviceType) {
      case "website":
        title = "Free Website";
        break;
      case "seo-audit":
        title = "Free SEO Audit";
        break;
      case "analytics":
        title = "Free Analytics Setup";
        break;
      default:
        return;
    }

    openModal(title, serviceType);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 h-full">
      {/* 1. Large Hero Image (Banner) - Mobile Order 1, Desktop Col-span-9 */}
      <div className="order-1 lg:order-none lg:col-span-9 flex flex-col gap-6">
        <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] rounded-2xl md:rounded-3xl lg:rounded-4xl overflow-hidden group">
          <Image
            src="/Assets/banner/Jia_Pixel_Banner.webp"
            alt="Hero Model"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 90vw, 75vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

          <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12 max-w-2xl">
            <motion.h2
              className="text-2xl md:text-5xl lg:text-6xl pb-3 lg:pb-4 font-serif text-white leading-tight"
              variants={itemVariants}
            >
              <span className="text-base md:text-xl">Welcome to Jia Pixel</span>
              <br />
              Your Partner in Digital <br />
              Transformation <br />
              <motion.span
                className="text-base md:text-3xl lg:text-4xl mt-2 lg:mt-4 text-white font-medium block min-h-[2rem] md:min-h-[4rem] lg:min-h-[5rem]"
                variants={itemVariants}
              >
                <TypeAnimation
                  sequence={[
                    "World Class Web Development ",
                    1500,
                    "SEO Optimization to Rank Higher",
                    1500,
                    "Best Digital Marketing Strategies",
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
              className="flex gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/projects">
                <button className="px-4 py-2 md:px-6 md:py-3 text-[12px] md:text-base cursor-pointer bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-1.5 md:gap-2">
                  <Code className="w-3.5 h-3.5 md:w-5 md:h-5" />
                  View Projects
                </button>
              </Link>
              <button
                onClick={openBooking}
                className="px-4 py-2 md:px-6 md:py-3 text-[12px] md:text-base cursor-pointer border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Book a Call
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. Service Cards - Mobile Order 2, Desktop Col-span-3 (Spans 2 rows visually by being in right col) */}
      <div className="order-2 lg:order-none lg:col-span-3 lg:row-span-2 grid grid-cols-3 lg:flex lg:flex-col gap-2 lg:gap-6">
        {/* Card 1 - Free Website */}
        <div
          className="relative flex flex-col lg:block h-auto lg:h-[220px] rounded-sm lg:rounded-4xl overflow-hidden group cursor-pointer gap-2"
          onClick={() => handleFreeServiceClick("website")}
        >
          <div className="relative w-full aspect-video lg:h-full rounded-sm lg:rounded-none overflow-hidden">
            <Image
              src="/Assets/portfolios/Loginbanner.webp"
              alt="Free Website"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 filter sepia-[.25]"
              sizes="(max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="relative w-full lg:w-[85%] xl:w-[75%] lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2">
            <div className="bg-white lg:bg-white/95 backdrop-blur-sm py-2 px-3 lg:py-3 lg:px-5 rounded-lg lg:rounded-full flex items-center justify-between shadow-sm lg:shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 lg:border-none">
              <span className="text-black font-bold text-[10px] lg:text-sm tracking-wide text-center leading-tight">
                Free Website
              </span>
              <div className="hidden lg:flex w-8 h-8 rounded-full bg-primary text-white items-center justify-center group-hover:scale-110 group-hover:ring-4 group-hover:ring-primary/20 transition-all duration-300">
                <ArrowRight
                  size={16}
                  className="text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - Free SEO Audit */}
        <div
          className="relative flex flex-col lg:block h-auto lg:h-[220px] rounded-sm lg:rounded-4xl overflow-hidden group cursor-pointer gap-2"
          onClick={() => handleFreeServiceClick("seo-audit")}
        >
          <div className="relative w-full aspect-video lg:h-full rounded-sm lg:rounded-none overflow-hidden">
            <Image
              src="/Assets/banner/Free-SEO-Audit-Jia-Pixel.webp"
              alt="Free SEO Audit"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[0.3]"
              sizes="(max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="relative w-full lg:w-[85%] xl:w-[75%] lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2">
            <div className="bg-white lg:bg-white/95 backdrop-blur-sm py-2 px-3 lg:py-3 lg:px-5 rounded-lg lg:rounded-full flex items-center justify-between shadow-sm lg:shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 lg:border-none">
              <span className="text-black font-bold text-[10px] lg:text-sm tracking-wide text-center leading-tight">
                Free SEO Audit
              </span>
              <div className="hidden lg:flex w-8 h-8 rounded-full bg-primary text-white items-center justify-center group-hover:scale-110 group-hover:ring-4 group-hover:ring-primary/20 transition-all duration-300">
                <ArrowRight
                  size={16}
                  className="text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Free Analytics */}
        <div
          className="relative flex flex-col lg:block h-auto lg:h-[220px] rounded-sm lg:rounded-4xl overflow-hidden group cursor-pointer gap-2"
          onClick={() => handleFreeServiceClick("analytics")}
        >
          <div className="relative w-full aspect-video lg:h-full rounded-sm lg:rounded-none overflow-hidden">
            <Image
              src="/Assets/banner/Free-Web-Analytics-Setup-Jia-Pixel.webp"
              alt="Free Analytics"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[0.8] contrast-125"
              sizes="(max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="relative w-full lg:w-[85%] xl:w-[75%] lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2">
            <div className="bg-white lg:bg-white/95 backdrop-blur-sm py-2 px-3 lg:py-3 lg:px-5 rounded-lg lg:rounded-full flex items-center justify-between shadow-sm lg:shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100 lg:border-none">
              <span className="text-black font-bold text-[10px] lg:text-sm tracking-wide text-center leading-tight">
                Free Analytics
              </span>
              <div className="hidden lg:flex w-8 h-8 rounded-full bg-primary text-white items-center justify-center group-hover:scale-110 group-hover:ring-4 group-hover:ring-primary/20 transition-all duration-300">
                <ArrowRight
                  size={16}
                  className="text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CEO Speech - Mobile Order 3, Desktop Col-span-9 */}
      <div className="order-3 lg:order-none lg:col-span-9">
        <div className="bg-linear-to-r from-gray-900 to-black rounded-2xl md:rounded-3xl lg:rounded-4xl p-4 md:p-8 lg:p-9 flex flex-row items-center justify-between gap-4 lg:gap-6 min-h-[100px] lg:min-h-[180px] border border-gray-800">
          <div className="flex-1">
            <h3 className="text-white text-sm lg:text-2xl font-bold mb-1 lg:mb-3">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-gray-300 text-[10px] lg:text-sm font-light leading-relaxed">
              <span className="italic line-clamp-2 lg:line-clamp-none">
                &quot;Let&apos;s build something amazing together. From concept
                to deployment, Jia Pixel...&quot;
              </span>
              <span className="block mt-1 text-[9px] lg:text-xs text-gray-400">
                -- Md. Imran Hossen, CEO
              </span>
            </p>
          </div>
          <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-full flex items-center justify-center group hover:scale-105 transition-all duration-300 shrink-0 shadow-lg overflow-hidden border-2 border-primary">
            <Image
              src="/Expert-Full-Stack-Web-Applications-Developer-in-Bangladesh-Md-Imran-Hossen-Jia-Pixel.png"
              height={80}
              width={80}
              alt="Md. Imran Hossen, CEO, Jia Pixel"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Free Service Modal */}
      <FreeServiceModal
        isOpen={isOpen}
        serviceTitle={serviceTitle}
        serviceType={serviceType}
        onClose={closeModal}
        onMessageSend={handleSendMessage}
      />
    </div>
  );
};
