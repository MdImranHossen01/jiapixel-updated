/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { generateHtml } from '@/lib/server-html';
import { extractTextFromProjectDescription } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProjectInquiryButton from "./components/ProjectInquiryButton";
import ProjectAdminActions from "@/components/ProjectAdminActions";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Fetch project via API for better caching control
async function getProject(slug: string) {
    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
            : 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/projects/${slug}`, {
            cache: 'force-cache'
        } as RequestInit);

        if (!response.ok) {
            if (response.status === 404) return null;
            console.error('Error fetching project:', response.status);
            return null;
        }

        const data = await response.json();
        return data.project || null;
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
}

// Generate static params for all projects (SSG)
export async function generateStaticParams() {
    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
            : 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/projects?limit=1000`, {
            cache: 'force-cache'
        } as RequestInit);

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.projects?.map((project: any) => ({
            slug: project.slug,
        })) || [];
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return {
            title: "Project Not Found - Jiapixel",
        };
    }

    const canonicalUrl = `/projects/${project.slug}`;

    const metaTitle = project.metaTitle || project.title;
    const metaDescription = project.metaDescription || extractTextFromProjectDescription(project.description).substring(0, 160);

    const siteUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
        : 'http://localhost:3000';

    const featuredImage = project.images?.[0] || "/Jia-pixel-your-partner-in-digital-transformation.png";
    const absoluteFeaturedImage = featuredImage.startsWith('http')
        ? featuredImage
        : `${siteUrl}${featuredImage.startsWith('/') ? '' : '/'}${featuredImage}`;

    return {
        title: metaTitle,
        description: metaDescription,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: canonicalUrl,
            siteName: "Jiapixel",
            images: [
                {
                    url: absoluteFeaturedImage,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: metaTitle,
            description: metaDescription,
            images: [absoluteFeaturedImage],
            creator: "@jiapixel",
        },
    };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    const siteUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_URL || 'https://www.jiapixel.com'
        : 'http://localhost:3000';

    const featuredImage = project.images?.[0] || "/Jia-pixel-your-partner-in-digital-transformation.png";
    const absoluteFeaturedImage = featuredImage.startsWith('http')
        ? featuredImage
        : `${siteUrl}${featuredImage.startsWith('/') ? '' : '/'}${featuredImage}`;

    // Generate structured data for this specific project page
    const projectStructuredData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.metaDescription || extractTextFromProjectDescription(project.description).substring(0, 200),
        author: {
            "@type": "Organization",
            name: "Jiapixel"
        },
        dateCreated: project.createdAt,
        dateModified: project.updatedAt,
        image: absoluteFeaturedImage,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/projects/${project.slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(projectStructuredData).replace(/</g, '\\u003c'),
                }}
            />
            <div className="overflow-clip py-8">
                <div className="container mx-auto px-4 w-full">
                    {/* 
                        Main Grid Strategy:
                        - On mobile (< lg): We use display: contents on the wrappers so all children become direct 
                          siblings in the grid, allowing global reordering via order-X classes.
                        - On desktop (>= lg): The wrappers become block/sticky containers, preserving the 2-column layout.
                    */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Wrapper 1: Title and Actions (Right Column on Desktop) */}
                        <div className="contents lg:block lg:col-span-1 lg:order-2 lg:sticky lg:top-24 self-start space-y-8">
                            {/* 1. Title - Mobile Order: 1 */}
                            <div className="order-1 flex items-start justify-between gap-4">
                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                                    {project.title}
                                </h1>
                                <ProjectAdminActions
                                    projectSlug={project.slug}
                                    projectTitle={project.title}
                                />
                            </div>

                            {/* 3. Action Card - Mobile Order: 3 */}
                            <div className="order-3 p-6 bg-card rounded-xl border border-border shadow-sm space-y-6 lg:mt-8">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Interested in a similar project?</p>
                                    <p className="text-lg font-medium">Get a custom quote today.</p>
                                </div>
                                <ProjectInquiryButton project={{ _id: project._id, title: project.title, slug: project.slug }} />
                            </div>
                        </div>

                        {/* Wrapper 2: Gallery and Description (Left Column on Desktop) */}
                        <div className="contents lg:block lg:col-span-2 lg:order-1 space-y-12">
                            {/* 2. Project Image Gallery - Mobile Order: 2 */}
                            <section className="order-2 mb-10 lg:mb-0">
                                <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-muted">
                                    {project.images && project.images.length > 0 ? (
                                        <Image
                                            src={project.images[0]}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="(max-width: 768px) 100vw, 66vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                {/* Additional Images */}
                                {project.images && project.images.length > 1 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                                        {project.images.slice(1).map((img: string, idx: number) => (
                                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                <Image
                                                    src={img}
                                                    alt={`${project.title} - ${idx + 2}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 50vw, 20vw"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* 4. Project Description - Mobile Order: 4 */}
                            <section className="order-4 mt-10 lg:mt-0">
                                <h2 className="text-3xl font-bold text-foreground mb-4 mt-8 border-b pb-2">
                                    Project Details
                                </h2>
                                <div className="prose prose-xl max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground font-sans leading-normal">
                                    <div
                                        className="ProseMirror p-0"
                                        dangerouslySetInnerHTML={{ __html: generateHtml(project.description) }}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Related Projects Section - Stays full width */}
                    {project.relatedProjects && project.relatedProjects.length > 0 && (
                        <section className="mt-20 pt-10 border-t">
                            <h2 className="text-3xl font-bold text-foreground mb-10">
                                Related Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {project.relatedProjects.map((related: any) => (
                                    <Link
                                        key={related._id}
                                        href={`/projects/${related.slug}`}
                                        className="group space-y-4"
                                    >
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                                            <Image
                                                src={related.images?.[0] || "/Jia-pixel-your-partner-in-digital-transformation.png"}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, 25vw"
                                            />
                                        </div>
                                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            {related.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}
