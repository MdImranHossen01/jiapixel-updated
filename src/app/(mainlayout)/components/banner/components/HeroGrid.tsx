import React from "react";
import { ArrowRight, Code } from "lucide-react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion, type Variants } from "framer-motion";
import { useFreeServiceModal } from "@/hooks/useFreeServiceModal";
import FreeServiceModal from "./FreeServiceModal";
import Link from "next/link";

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const HeroGrid: React.FC = () => {
  const { isOpen, serviceTitle, serviceType, openModal, closeModal } =
    useFreeServiceModal();

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column Container (Spans 8) */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        {/* Large Hero Image */}
        <div className="relative w-full h-[400px] lg:h-[500px] rounded-4xl overflow-hidden group">
          <Image
            src="/Assets/banner/Jia_Pixel_Banner.webp"
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
              <span className="text-xl">Welcome to Jia Pixel</span>
              <br />
              Your Partner in Digital <br />
              Transformation <br />
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
              <Link href="/services">
              <button className="px-6 py-3 cursor-pointer bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2">
                <Code size={20} />
                View Projects
              </button>
              </Link>
              <Link href="/messages">
                <button className="px-6 py-3 cursor-pointer border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                  Contact Me
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Left CTA Card */}
        <motion.div
          className="bg-gradient-to-r from-gray-900 to-black rounded-4xl p-8 lg:p-9 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[180px] border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex-1">
            <h3 className="text-white text-xl lg:text-2xl font-bold mb-3">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              <span className="italic ">
                &quot;Let&apos;s build something amazing together. From concept
                to deployment, I deliver cutting-edge solutions that drive
                results.&quot;
              </span>
              <br />
              -- Md. Imran Hossen, CEO, Jia Pixel
            </p>
          </div>
         <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full  flex items-center justify-center group hover:scale-105 transition-all duration-300 shrink-0 shadow-lg overflow-hidden border-2 border-primary">
  <Image
    src="/Expert-Full-Stack-Web-Applications-Developer-in-Bangladesh-Md-Imran-Hossen-Jia-Pixel.png"
    height={80}
    width={80}
    alt="Md. Imran Hossen, CEO, Jia Pixel"
    className="w-full h-full object-cover"
  />
</div>
        </motion.div>
      </div>

      {/* Right Column Container (Spans 4) */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {/* Card 1 - Free Website */}
        <div
          className="relative h-[220px] rounded-4xl overflow-hidden group cursor-pointer"
          onClick={() => handleFreeServiceClick("website")}
        >
          <Image
            src="/Assets/portfolios/Loginbanner.webp"
            alt="Free Website"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 filter sepia-[.25]"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm py-3 px-4 rounded-full flex items-center justify-between shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-black font-bold text-sm tracking-wide">
                Free Website
              </span>
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300">
                <ArrowRight
                  size={14}
                  className="text-black group-hover:text-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - Free SEO Audit */}
        <div
          className="relative h-[220px] rounded-4xl overflow-hidden group cursor-pointer"
          onClick={() => handleFreeServiceClick("seo-audit")}
        >
          <Image
            src="/Assets/banner/Free-SEO-Audit-Jia-Pixel.webp"
            alt="Free SEO Audit"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[0.3]"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm py-3 px-4 rounded-full flex items-center justify-between shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-black font-bold text-sm tracking-wide">
                Free SEO Audit
              </span>
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300">
                <ArrowRight
                  size={14}
                  className="text-black group-hover:text-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Free Analytics Setup */}
        <div
          className="relative h-[220px] rounded-4xl overflow-hidden group cursor-pointer"
          onClick={() => handleFreeServiceClick("analytics")}
        >
          <Image
            src="/Assets/banner/Free-Web-Analytics-Setup-Jia-Pixel.webp"
            alt="Free Analytics Setup"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[0.8] contrast-125"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm py-3 px-4 rounded-full flex items-center justify-between shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-black font-bold text-sm tracking-wide">
                Free Analytics Setup
              </span>
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300">
                <ArrowRight
                  size={14}
                  className="text-black group-hover:text-white transition-colors"
                />
              </div>
            </div>
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
