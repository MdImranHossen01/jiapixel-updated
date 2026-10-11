import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            {/* Top Back Nav Skeleton */}
            <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-6 w-36 rounded-md" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-8">
                    <article className="border rounded-lg p-8 h-full bg-card space-y-6">
                        <Skeleton className="h-10 md:h-12 w-full rounded-md" />
                        <Skeleton className="h-10 md:h-12 w-3/4 rounded-md" />

                        <div className="flex items-center justify-between gap-4 pb-6 border-b border-border">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>

                        <div className="space-y-4 pt-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-64 w-full rounded-xl my-6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </article>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="aspect-[1024/570] w-full rounded-lg" />
                                    <Skeleton className="h-5 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
