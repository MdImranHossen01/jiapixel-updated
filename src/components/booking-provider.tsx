"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const PopupModal = dynamic(() => import("react-calendly").then((mod) => mod.PopupModal), { ssr: false });
import { CONTACT_INFO } from "@/constants/contact";

interface BookingContextType {
    openBooking: () => void;
    closeBooking: () => void;
    isBookingOpen: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const openBooking = () => setIsOpen(true);
    const closeBooking = () => setIsOpen(false);

    return (
        <BookingContext.Provider value={{ openBooking, closeBooking, isBookingOpen: isOpen }}>
            {children}
            {mounted && isOpen && (
                <PopupModal
                    url={CONTACT_INFO.calendlyUrl}
                    onModalClose={() => setIsOpen(false)}
                    open={isOpen}
                    rootElement={document.body}
                />
            )}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
}
