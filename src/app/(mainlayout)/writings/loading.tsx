import { Skeleton } from "@/components/ui/skeleton";
import { GridSkeleton } from "@/components/CardSkeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-border pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Writings Cards Grid */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col space-y-4 bg-card border rounded-md p-4">
                                <Skeleton className="aspect-[1024/570] w-full rounded-md" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
                        <Skeleton className="h-6 w-36" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <Skeleton className="w-20 h-16 rounded-md shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
