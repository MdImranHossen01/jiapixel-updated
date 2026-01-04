import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import connectDB from '@/lib/db'
import Service from '@/models/Project'
import ServiceCard from '@/components/ServiceCard'

export const metadata: Metadata = {
    title: 'Best Web Design and Development Services | Jia Pixel',
    description: 'Elevate your brand with the best web design and development services by Jia Pixel. We offer custom, high-performance, and SEO-friendly web solutions.',
    alternates: {
        canonical: '/best-web-design-and-development-services',
    }
}

export default async function BestWebDesignPage() {
    await connectDB();
    const servicesData = await Service.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();

    // Serialize data to resolve "Only plain objects can be passed to Client Components" error
    const latestServices = JSON.parse(JSON.stringify(servicesData));

    return (
        <article className="container mx-auto px-4 py-12">
            {/* Hero / Header Section */}
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                    Best Web Design and Development Services to Elevate Your Brand
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                    Transforming Ideas into High-Performance Digital Experiences with Jia Pixel
                </p>
            </header>

            {/* Latest Services Section */}
            {latestServices && latestServices.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Our Latest Services
                    </h2>
                    <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-4 md:gap-6 md:pb-0 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {latestServices.map((service: any) => (
                            <div key={service._id} className="min-w-[85%] md:min-w-0 snap-center">
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none text-gray-700">
                <section className="mb-10">
                    <p className="mb-6 leading-relaxed">
                        In the modern digital landscape, your website is more than just an online brochure; it is the heart of your business operations and your most powerful marketing tool. At <strong>Jia Pixel</strong>, we offer the <strong>best web design and development services</strong> tailored to help businesses stand out, engage users, and drive conversions. Whether you are a startup looking for a launchpad or an established enterprise seeking a digital transformation, our full-stack solutions are engineered for success.
                    </p>
                    <p className="leading-relaxed">
                        A website needs to look good, but it also needs to perform. Research shows that users form an opinion about your brand in 0.05 seconds. If your site is slow, unresponsive, or outdated, you are losing potential revenue. We bridge the gap between stunning aesthetics and robust technical performance, ensuring your digital presence is future-proof.
                    </p>
                </section>

                {/* Features Section */}
                <section className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Comprehensive Web Solutions We Offer
                    </h2>
                    <p className="mb-6">
                        We don&apos;t believe in &quot;one-size-fits-all&quot; templates. Our approach is bespoke, focusing on your specific industry needs.
                    </p>
                    <ul className="list-disc pl-6 space-y-4">
                        <li>
                            <strong>Custom UI/UX Design:</strong> We create visually striking interfaces that align perfectly with your brand identity. Our designs focus on &quot;User Experience&quot; (UX) first, ensuring intuitive navigation that guides visitors toward making a purchase or booking a service.
                        </li>
                        <li>
                            <strong>Full-Stack Development:</strong> Utilizing cutting-edge technologies like <strong>Next.js, React, and Node.js</strong>, we build websites that are secure, scalable, and lightning-fast. Unlike basic WordPress themes, our custom builds offer superior performance and security.
                        </li>
                        <li>
                            <strong>Mobile-First Architecture:</strong> With mobile traffic dominating the internet, we design for the smallest screen first. Your site will provide a flawless experience across smartphones, tablets, and desktops.
                        </li>
                        <li>
                            <strong>SEO-Integrated Development:</strong> A beautiful site is useless if no one sees it. We build with clean code, proper schema markup, and optimized metadata to ensure a strong foundation for your <Link href="/services" className="text-primary hover:underline font-medium">Local SEO campaigns</Link>.
                        </li>
                        <li>
                            <strong>E-Commerce Solutions:</strong> From secure payment gateway integration to inventory management, we build robust online stores that simplify the buying process for your customers.
                        </li>
                    </ul>
                </section>

                {/* Why Choose Us Section */}
                <section className="mb-10 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Why We Are the Best Choice for Your Business
                    </h2>
                    <p className="mb-6">
                        Choosing a web development partner is a strategic decision. Here is why <strong>Jia Pixel</strong> stands out as the provider of the best web design and development services:
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="text-primary text-xl">✓</span>
                            <span>
                                <strong>Speed Optimization:</strong> We obsess over performance. We optimize images, scripts, and server responses to ensure your site passes <a href="https://developers.google.com/search/docs/appearance/core-web-vitals" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google’s Core Web Vitals</a> assessment.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary text-xl">✓</span>
                            <span>
                                <strong>Transparent Process:</strong> No hidden fees or technical jargon. We keep you involved at every stage, from the initial wireframe to the final launch.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary text-xl">✓</span>
                            <span>
                                <strong>Post-Launch Support:</strong> We don&apos;t just launch and leave. We offer ongoing maintenance packages to keep your website updated, secure, and running smoothly.
                            </span>
                        </li>
                    </ul>
                </section>



                {/* Target Audience Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Who Is This Service For?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-2">Small Businesses</h3>
                            <p>Looking to establish credibility and attract local customers.</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-2">Medical Professionals</h3>
                            <p>Needing HIPAA-compliant and reassuring <Link href="/services/best-medical-doctors-website-design-and-development" className="text-primary hover:underline">doctor website designs</Link>.</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-2">Restaurants</h3>
                            <p>Requiring dynamic menus and booking integrations.</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-2">Corporate Agencies</h3>
                            <p>Needing a high-authority digital portfolio.</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center bg-primary/5 py-12 px-6 rounded-3xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Build Your Digital Empire?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Don&apos;t settle for mediocrity. Invest in a website that works as hard as you do. Join the hundreds of satisfied clients who have transformed their business with Jia Pixel.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Contact Us Today
                        </Link>
                        <Link
                            href="/portfolios"
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary bg-white border border-primary rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            View Our Portfolio
                        </Link>
                    </div>
                </section>
            </div>
        </article>
    )
}