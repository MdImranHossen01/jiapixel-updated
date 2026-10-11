import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="overflow-clip py-8 animate-in fade-in duration-500">
            <div className="container mx-auto px-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Right column: Title & Inquiry card */}
                    <div className="space-y-8 lg:col-span-1 lg:order-2 self-start">
                        <div className="space-y-3">
                            <Skeleton className="h-8 md:h-10 w-full rounded-md" />
                            <Skeleton className="h-8 md:h-10 w-3/4 rounded-md" />
                        </div>
                        <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-11 w-full rounded-md" />
                            <Skeleton className="h-11 w-full rounded-md" />
                        </div>
                    </div>

                    {/* Left column: Main Gallery image & Details */}
                    <div className="space-y-10 lg:col-span-2 lg:order-1">
                        <div className="space-y-4">
                            <Skeleton className="aspect-video w-full rounded-xl" />
                            <div className="grid grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="aspect-video w-full rounded-lg" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border">
                            <Skeleton className="h-8 w-48 mb-4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
