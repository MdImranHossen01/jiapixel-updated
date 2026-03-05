"use client";

import React from "react";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProjectInquiryButtonProps {
    project: {
        _id: string;
        title: string;
        slug: string;
    };
}

const ProjectInquiryButton = ({ project }: ProjectInquiryButtonProps) => {
    const {
        isOpen,
        openModal,
        closeModal,
        selectedTier,
        serviceTitle
    } = useAuthModal();

    const getProjectUrl = () => {
        if (typeof window !== "undefined") {
            return `${window.location.origin}/projects/${project.slug}`;
        }
        return "";
    };

    const handleSendMessage = async (message: string) => {
        try {
            // Fetch admin user
            const usersResponse = await fetch("/api/users?role=admin");
            if (!usersResponse.ok) {
                throw new Error("Failed to fetch admin user");
            }

            const usersData = await usersResponse.json();
            const adminUsers = usersData.users || [];

            if (adminUsers.length === 0) {
                toast.error("Admin user not found. Please try again later.");
                return;
            }

            const adminUser = adminUsers[0];

            // Send message
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
                toast.success("Message sent to admin successfully! They will get back to you soon.");
            } else {
                toast.error("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Error processing your request. Please try again.");
        }
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => openModal(project.title, null, getProjectUrl())}
                >
                    Ask for Details
                </Button>

                <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full border-primary text-primary hover:bg-primary/5 font-semibold"
                >
                    <a href="/estimate">Get Estimate</a>
                </Button>
            </div>

            <AuthModal
                isOpen={isOpen}
                serviceTitle={project.title}
                serviceUrl={getProjectUrl()}
                onClose={closeModal}
                onMessageSend={handleSendMessage}
            />
        </>
    );
};

export default ProjectInquiryButton;
