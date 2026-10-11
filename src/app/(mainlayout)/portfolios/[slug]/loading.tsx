import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background animate-in fade-in duration-500">
            {/* Hero Section Skeleton */}
            <section className="relative bg-slate-900 py-20">
                <div className="container relative mx-auto px-4 max-w-4xl text-center space-y-4">
                    <Skeleton className="h-6 w-32 mx-auto rounded-full bg-slate-800" />
                    <Skeleton className="h-10 md:h-14 w-full md:w-3/4 mx-auto rounded-md bg-slate-800" />
                    <Skeleton className="h-4 w-96 mx-auto rounded-md bg-slate-800" />
                </div>
            </section>

            {/* Content Section Skeleton */}
            <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
                {/* Main Showcase Image Skeleton */}
                <Skeleton className="aspect-[1366/768] w-full rounded-2xl shadow-xl" />

                {/* Details / Prose Skeleton */}
                <div className="space-y-4 max-w-3xl mx-auto pt-6">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    );
}
