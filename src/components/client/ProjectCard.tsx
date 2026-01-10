"use client";

import React from "react";
import { IClientProject } from "@/models/ClientProject";
import { FileText, Download, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
    project: IClientProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-500";
            case "pending": return "bg-yellow-500";
            case "completed": return "bg-blue-500";
            case "cancelled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{project.title}</h3>
                            <Badge variant="outline" className={getStatusColor(project.status) + " text-white border-none"}>
                                {project.status.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{project.serviceType}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                        <p>Started: {formatDate(project.startDate)}</p>
                        {project.endDate && <p>Due: {formatDate(project.endDate)}</p>}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                </div>

                <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <FileText size={16} /> Documents
                    </h4>
                    {project.documents.length > 0 ? (
                        <div className="space-y-2">
                            {project.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="truncate max-w-[150px]">{doc.title}</span>
                                        <Badge variant="secondary" className="text-[10px] h-5">{doc.type}</Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                            <Download size={14} />
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No documents uploaded.</p>
                    )}
                </div>

                <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <DollarSign size={16} /> Invoices
                    </h4>
                    {project.invoices.length > 0 ? (
                        <div className="space-y-2">
                            {project.invoices.map((inv, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">${inv.amount}</span>
                                        {inv.status === 'paid' && <CheckCircle size={14} className="text-green-500" />}
                                        {inv.status === 'pending' && <Clock size={14} className="text-yellow-500" />}
                                        {inv.status === 'overdue' && <AlertCircle size={14} className="text-red-500" />}
                                    </div>
                                    {inv.url && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                            <a href={inv.url} target="_blank" rel="noopener noreferrer">
                                                <Download size={14} />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No invoices.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
