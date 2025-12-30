"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const SplashScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 dark:bg-gray-950 z-[9999]">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <Image
                    src="/Jia-Pixel-Logo.svg"
                    alt="Jia Pixel Loading"
                    width={80}
                    height={80}
                    priority
                    className="w-20 h-20 md:w-24 md:h-24"
                />
            </motion.div>
        </div>
    );
};

export default SplashScreen;
