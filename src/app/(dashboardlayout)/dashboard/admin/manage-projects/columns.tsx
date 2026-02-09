"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, ExternalLink, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import Image from "next/image"

export type Project = {
    _id: string
    title: string
    slug: string
    createdAt: string
    isIndexedInGoogle: boolean
    images: string[]
}

const GoogleIndexCell = ({ slug, isIndexed }: { slug: string; isIndexed: boolean }) => {
    const router = useRouter();

    const handleIndexToggle = async (checked: boolean) => {
        try {
            const res = await fetch(`/api/projects/${slug}`, {
                method: 'PUT',
                body: JSON.stringify({ isIndexedInGoogle: checked }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                toast.success(`Google Index status updated to ${checked ? 'Indexed' : 'Not Indexed'}`);
                router.refresh();
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to update status");
            }
        } catch (e) {
            console.error("Error updating status:", e);
            toast.error("Error updating status");
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isIndexed}
                onCheckedChange={handleIndexToggle}
            />
            <span className="text-sm text-muted-foreground">{isIndexed ? "Yes" : "No"}</span>
        </div>
    )
}

const ActionsCell = ({ project }: { project: Project }) => {
    const router = useRouter();

    const handleDelete = async () => {
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
            try {
                const res = await fetch(`/api/projects/${project.slug}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success("Project deleted successfully");
                    router.refresh();
                } else {
                    const data = await res.json();
                    toast.error(data.message || "Failed to delete project");
                }
            } catch (error) {
                console.error("Error deleting project:", error);
                toast.error("An error occurred while deleting");
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => router.push(`/projects/${project.slug}`)}
                >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/admin/manage-projects/edit/${project.slug}`)}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "images",
        header: "Image",
        cell: ({ row }) => {
            const images = row.getValue("images") as string[];
            const imageUrl = images && images.length > 0 ? images[0] : "/placeholder-image.jpg";
            return (
                <div className="relative h-10 w-16 rounded overflow-hidden border">
                    <Image
                        src={imageUrl}
                        alt={row.getValue("title") as string}
                        fill
                        className="object-cover"
                    />                </div>
            )
        },
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return <div>{date.toLocaleDateString()}</div>
        },
    },
    {
        accessorKey: "isIndexedInGoogle",
        header: "Google Index",
        cell: ({ row }) => {
            const project = row.original;
            return <GoogleIndexCell slug={project.slug} isIndexed={project.isIndexedInGoogle} />
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const project = row.original
            return <ActionsCell project={project} />
        },
    },
]
