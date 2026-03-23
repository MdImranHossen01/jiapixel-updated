/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
    MoreVertical, Edit, Trash2, Eye, 
    FileText, Download, DollarSign, Clock, CheckCircle, AlertCircle 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Swal from "sweetalert2";

interface ProjectCardProps {
    project: any;
    clientMode?: boolean;
}

export default function ProjectCard({ project, clientMode = false }: ProjectCardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Determine image and link based on project type
    const featuredImage = project.images?.[0] || project.featuredImage || "/placeholder-image.jpg";
    const isAdmin = session?.user?.role === "admin";
    const projectUrl = clientMode ? "#" : `/projects/${project.slug}`;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${project.title}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setIsDeleting(true);
            try {
                const identifier = clientMode ? project._id : project.slug;
                
                if (!identifier) {
                    console.error("Missing project identifier for deletion");
                    Swal.fire('Error!', 'Project identifier is missing.', 'error');
                    setIsDeleting(false);
                    return;
                }

                const endpoint = clientMode ? `/api/client/projects/${identifier}` : `/api/projects/${identifier}`;
                const response = await fetch(endpoint, {
                    method: "DELETE",
                });

                if (response.ok) {
                    Swal.fire('Deleted!', 'The project has been deleted.', 'success');
                    router.refresh();
                } else {
                    Swal.fire('Failed!', 'Failed to delete project.', 'error');
                }
            } catch (error) {
                console.error("Error deleting project:", error);
                Swal.fire('Error!', 'An error occurred while deleting the project.', 'error');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "active": return "bg-green-500";
            case "pending": return "bg-yellow-500";
            case "completed": return "bg-blue-500";
            case "cancelled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const formatDate = (date: any) => {
        if (!date) return "";
        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) return "";
        return parsed.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="group relative flex flex-col h-full">
            <div className="flex-grow space-y-4">
                <Link href={projectUrl} className={clientMode ? "cursor-default" : "block"}>
                    <div className="relative aspect-[1024/570] rounded-xl overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <Image
                            src={featuredImage}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Status Badge for Client Mode */}
                        {clientMode && project.status && (
                            <div className="absolute top-3 left-3">
                                <Badge className={`${getStatusColor(project.status)} text-white border-none shadow-sm`}>
                                    {project.status.toUpperCase()}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                {project.title}
                            </h3>
                            {clientMode && project.serviceType && (
                                <span className="text-xs text-muted-foreground whitespace-nowrap px-2 py-1 bg-muted rounded-full">
                                    {project.serviceType}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>

                {/* Client Detailed Info */}
                {clientMode && (
                    <div className="space-y-4 pt-2 border-t border-border/50">
                        {/* Dates */}
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Started: {formatDate(project.startDate)}</span>
                            {project.endDate && <span>Due: {formatDate(project.endDate)}</span>}
                        </div>

                        {/* Progress */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                                <span>Project Progress</span>
                                <span>{project.progress || 0}%</span>
                            </div>
                            <Progress value={project.progress || 0} className="h-1.5" />
                        </div>

                        {/* Documents & Invoices Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Documents */}
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <FileText size={12} /> Documents
                                </h4>
                                <div className="space-y-1.5">
                                    {project.documents?.length > 0 ? (
                                        project.documents.slice(0, 2).map((doc: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-1.5 bg-muted/40 rounded text-[11px]">
                                                <span className="truncate max-w-[80px]" title={doc.title}>{doc.title}</span>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                                    <Download size={12} />
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground italic">No docs</span>
                                    )}
                                </div>
                            </div>

                            {/* Invoices */}
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <DollarSign size={12} /> Invoices
                                </h4>
                                <div className="space-y-1.5">
                                    {project.invoices?.length > 0 ? (
                                        project.invoices.slice(0, 2).map((inv: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-1.5 bg-muted/40 rounded text-[11px]">
                                                <span className="font-medium">${inv.amount}</span>
                                                <div className="flex items-center gap-1">
                                                    {inv.status === 'paid' && <CheckCircle size={10} className="text-green-500" />}
                                                    {inv.status === 'pending' && <Clock size={10} className="text-yellow-500" />}
                                                    {inv.url && (
                                                        <a href={inv.url} target="_blank" rel="noopener noreferrer" className="text-primary ml-0.5">
                                                            <Download size={10} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground italic">No invoices</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Admin Actions Overlay (Only for non-client mode or admin view in dashboard?) */}
            {isAdmin && !clientMode && (
                <div className="absolute top-2 right-2 z-10 transition-opacity opacity-0 group-hover:opacity-100">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-background/60 hover:bg-background/90 backdrop-blur-md shadow-sm border border-border/50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => router.push(`/projects/${project.slug}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/manage-projects/edit/${project.slug}`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting ? "Deleting..." : "Delete Project"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
}
