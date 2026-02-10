/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { generateHtml } from '@/lib/server-html';
import { extractTextFromProjectDescription } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

    const featuredImage = project.images?.[0] || "/icon.png";

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
                    url: featuredImage,
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
            images: [featuredImage],
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
        image: project.images?.[0] || "https://www.jiapixel.com/icon.png",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.jiapixel.com/projects/${project.slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(projectStructuredData),
                }}
            />
            <div className="overflow-hidden py-8">
                <div className="container mx-auto px-4 w-full">

                    {/* Hero Section */}
                    <section className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                                    {project.title}
                                </h1>
                                <div className="flex gap-4">
                                    <Link href={`/contact?subject=Inquiry about ${project.title}`}>
                                        <Button size="lg">Ask for Details</Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Image Gallery / Featured Image */}
                            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-muted">
                                {project.images && project.images.length > 0 ? (
                                    <Image
                                        src={project.images[0]}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                        No image available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Images (if any) */}
                        {project.images && project.images.length > 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                {project.images.slice(1).map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <Image
                                            src={img}
                                            alt={`${project.title} - ${idx + 2}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Project Description */}
                    <section className="py-8">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-foreground mb-6 border-b pb-2">
                                Project Details
                            </h2>

                            <div className="prose prose-xl max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
                                {/* Server-side rendered content for SEO/Crawlers */}
                                <div
                                    className="prose prose-xl max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: generateHtml(project.description) }}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
