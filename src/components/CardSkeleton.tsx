import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            <Skeleton className="aspect-[1024/570] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
