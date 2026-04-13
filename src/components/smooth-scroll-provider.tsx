"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        // Disable Lenis on mobile devices or touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobile = window.innerWidth <= 768;

        if (isTouchDevice || isMobile) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            prevent: (node) => {
                return (
                    node.nodeName === "PRE" ||
                    node.nodeName === "CODE" ||
                    !!node.closest("[data-lenis-prevent]") ||
                    !!node.closest(".overflow-y-auto") ||
                    !!node.closest(".overflow-x-auto") ||
                    !!node.closest(".overflow-auto")
                );
            },
        });

        let rafId: number;

        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
};
