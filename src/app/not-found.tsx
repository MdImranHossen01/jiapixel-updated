"use client";

import Link from "next/link";
import { ArrowLeft, Home, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Aesthetic Layers */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] bg-gradient-to-r from-primary to-purple-600 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="z-10 text-center space-y-8 max-w-2xl mx-auto">

                {/* 404 Typography */}
                <div className="relative">
                    <h1 className="text-[8rem] md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-indigo-600 leading-none drop-shadow-xl select-none">
                        404
                    </h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                        <div className="text-xl md:text-2xl font-bold bg-background/80 backdrop-blur-sm mx-auto w-fit px-6 py-2 rounded-full border border-primary/20 shadow-lg text-foreground">
                            Page Not Found
                        </div>
                    </div>
                </div>

                {/* Messaging */}
                <div className="space-y-4">
                    <p className="text-lg md:text-xl text-muted-foreground px-4">
                        Oops! It seems you've ventured into uncharted territory. The page you're looking for has either moved or doesn't exist.
                    </p>
                </div>

                {/* Smart Navigation Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                    <Button variant="default" className="w-full flex items-center justify-center gap-2 h-12" asChild>
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Return Home
                        </Link>
                    </Button>

                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10 transition-all" asChild>
                        <Link href="/blogs">
                            <BookOpen className="w-4 h-4" />
                            Read Blogs
                        </Link>
                    </Button>

                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10 transition-all" asChild>
                        <Link href="/projects">
                            <Layers className="w-4 h-4" />
                            View Projects
                        </Link>
                    </Button>
                </div>

                {/* Fallback back button */}
                <div className="pt-8">
                    <button
                        onClick={() => window.history.back()}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mx-auto text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back to Previous Page
                    </button>
                </div>

            </div>
        </div>
    );
}
