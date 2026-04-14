/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit, Trash2, Eye, ExternalLink } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { extractTextFromProjectDescription } from "@/lib/utils";
import Swal from "sweetalert2";

interface PortfolioCardProps {
    portfolio: any;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const isAdmin = session?.user?.role === "admin";

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const result = await Swal.fire({
            title: 'Delete Portfolio?',
            text: `Are you sure you want to delete "${portfolio.title}"? This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setIsDeleting(true);
            try {
                const response = await fetch(`/api/portfolios/${portfolio.slug}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Portfolio has been removed.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    router.refresh();
                } else {
                    const data = await response.json();
                    Swal.fire('Error!', data.error || 'Failed to delete portfolio.', 'error');
                }
            } catch (error) {
                console.error("Error deleting portfolio:", error);
                Swal.fire('Error!', 'An unexpected error occurred.', 'error');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <article className="group relative bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] flex flex-col h-full">
            {/* Image Section */}
            <div className="relative aspect-[1366/768] overflow-hidden shrink-0 bg-muted">
                <Image
                    src={portfolio.featuredImage || '/api/placeholder/400/250'}
                    alt={portfolio.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {portfolio.featured && (
                        <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                            Featured
                        </span>
                    )}
                </div>

                {/* View Overlay on Hover - Subtle link to detail page */}
                <Link
                    href={`/portfolios/${portfolio.slug}`}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    prefetch={false}
                />
            </div>

            {/* Content Section */}
            <div className="px-2 py-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        <Link href={`/portfolios/${portfolio.slug}`} prefetch={false}>
                            {portfolio.title}
                        </Link>
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                        {portfolio.metaDescription || extractTextFromProjectDescription(portfolio.content)}
                    </p>
                </div>

                {/* Footer - View Live Button */}
                <div className="mt-auto pt-4 border-t border-border/50">
                    <Link
                        href={portfolio.projectUrl || `/portfolios/${portfolio.slug}`}
                        target={portfolio.projectUrl ? "_blank" : undefined}
                        rel={portfolio.projectUrl ? "noopener noreferrer" : undefined}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${portfolio.projectUrl
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                        prefetch={false}
                    >
                        {portfolio.projectUrl ? (
                            <>
                                View Live <ExternalLink size={16} />
                            </>
                        ) : (
                            <>
                                View Details <Eye size={16} />
                            </>
                        )}
                    </Link>
                </div>
            </div>

            {/* Admin Actions - Corner Menu */}
            {isAdmin && (
                <div className="absolute top-2 right-2 z-20 transition-opacity opacity-0 group-hover:opacity-100">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 bg-background/80 backdrop-blur-md shadow-sm hover:bg-background border border-border/50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 p-1">
                            <DropdownMenuItem
                                onClick={() => router.push(`/portfolios/${portfolio.slug}`)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" /> View Live
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/admin/manage-portfolios/edit/${portfolio.slug}`)}
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting ? "Removing..." : "Delete Project"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </article>
    );
};

export default PortfolioCard;
