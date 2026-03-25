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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import Image from "next/image"

export type Portfolio = {
    _id: string
    title: string
    slug: string
    featured: boolean
    isIndexedInGoogle: boolean
    featuredImage: string
    createdAt: string
}

const GoogleIndexCell = ({ slug, isIndexed }: { slug: string; isIndexed: boolean }) => {
    const router = useRouter();

    const handleIndexToggle = async (checked: boolean) => {
        try {
            const res = await fetch(`/api/portfolios/${slug}`, {
                method: 'PUT',
                body: JSON.stringify({ isIndexedInGoogle: checked }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                toast.success(`Google Index status updated to ${checked ? 'Indexed' : 'Not Indexed'}`);
                router.refresh();
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to update status");
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

const FeaturedCell = ({ portfolioId, slug, featured }: { portfolioId: string; slug: string; featured: boolean }) => {
    const router = useRouter();

    const handleFeaturedToggle = async (checked: boolean) => {
        try {
            const res = await fetch(`/api/portfolios/${slug}`, {
                method: 'PUT',
                body: JSON.stringify({ featured: checked }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                toast.success(`Featured status updated to ${checked ? 'Featured' : 'Not Featured'}`);
                router.refresh();
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to update featured status");
            }
        } catch (e) {
            console.error("Error updating featured status:", e);
            toast.error("Error updating featured status");
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={featured}
                onCheckedChange={handleFeaturedToggle}
            />
        </div>
    )
}

const ActionsCell = ({ portfolio }: { portfolio: Portfolio }) => {
    const router = useRouter();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${portfolio.title}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/portfolios/${portfolio.slug}`, { method: 'DELETE' });
                if (res.ok) {
                    toast.success("Portfolio deleted successfully");
                    router.refresh();
                } else {
                    const data = await res.json();
                    toast.error(data.error || "Failed to delete portfolio");
                }
            } catch (error) {
                console.error("Error deleting portfolio:", error);
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
                    onClick={() => window.open(`/portfolios/${portfolio.slug}`, '_blank')}
                >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/admin/manage-portfolios/edit/${portfolio.slug}`)}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Portfolio
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Portfolio
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<Portfolio>[] = [
    {
        accessorKey: "featuredImage",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("featuredImage") as string || "/placeholder-image.jpg";
            return (
                <div className="relative h-10 w-16 rounded overflow-hidden border">
                    <Image
                        src={imageUrl}
                        alt={row.getValue("title") as string}
                        fill
                        className="object-cover"
                    />
                </div>
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
        cell: ({ row }) => {
            const title: string = row.getValue("title");
            const truncated = title.length > 30 ? title.substring(0, 30) + "..." : title;
            const slug: string = row.original.slug;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={`/portfolios/${slug}`} target="_blank" className="font-medium hover:underline text-primary">
                                {truncated}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{title}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
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
        id: "daysAgo",
        header: "Days Ago",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            const now = new Date();

            date.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);

            const msPerDay = 1000 * 60 * 60 * 24;
            const diffMs = now.getTime() - date.getTime();

            if (diffMs > 0) {
                const diffDays = Math.floor(diffMs / msPerDay);
                if (diffDays === 0) return "Today";
                if (diffDays === 1) return "1 day ago";
                return `${diffDays} days ago`;
            } else {
                const futureDays = Math.floor(Math.abs(diffMs) / msPerDay);
                if (futureDays === 0) return "Today";
                if (futureDays === 1) return "In 1 day";
                return `In ${futureDays} days`;
            }
        },
    },
    {
        accessorKey: "isIndexedInGoogle",
        header: "Google Index",
        cell: ({ row }) => {
            const portfolio = row.original;
            return <GoogleIndexCell slug={portfolio.slug} isIndexed={portfolio.isIndexedInGoogle} />
        },
    },
    {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => {
            const portfolio = row.original;
            return <FeaturedCell portfolioId={portfolio._id} slug={portfolio.slug} featured={portfolio.featured} />
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const portfolio = row.original
            return <ActionsCell portfolio={portfolio} />
        },
    },
]
