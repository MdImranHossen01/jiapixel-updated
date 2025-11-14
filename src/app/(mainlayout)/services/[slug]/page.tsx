import { Metadata } from "next"; // Added Metadata import
import { notFound } from "next/navigation";
import RichTextRenderer from "@/components/RichTextRenderer";
import PricingComponent from "../components/Pricing";
import { FAQSection } from "../components/Faq";
import ServiceSteps from "../components/ServiceSteps";
import AuthorQuote from "../components/AuthorQuote";
import HeroSection from "../components/HeroSection";

// --- FIX 1: Model থেকে IService interface টি ইমপোর্ট করুন ---
// এটি আপনার service ভেরিয়েবলকে নিশ্চিত করবে যে সমস্ত প্রয়োজনীয় প্রপস (author, authorQuote, tiers, faqs, etc.) এতে আছে।
import { IService } from '@/models/Project'; 

// BASE URL ডিফাইন করা হলো
const BASE_URL = "https://www.jiapixel.com"; 

// IService টাইপকে ব্যবহার করার জন্য alias
type ServiceData = IService;


interface PageProps {
  params: {
    slug: string;
  };
}

// --- FIX 2: getService ফাংশনকে IServiceData রিটার্ন করতে বাধ্য করুন ---
async function getService(slug: string): Promise<ServiceData | null> {
  try {
    // Use environment-aware URL for API calls
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/services/${slug}`, {
      cache: 'force-cache'
    });

    if (!response.ok) {
      console.error('Error fetching service:', response.status);
      return null;
    }

    const data = await response.json();
    
    // ডেটা ফেচিং সফল হলে, এটিকে নিশ্চিত IServiceData টাইপে রিটার্ন করা হলো
    return data.service as ServiceData || null; 
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}


// --- generateMetadata ফাংশন (পূর্বের SEO ফিক্স সহ) ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await getService(params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }
  
  const currentUrl = `${BASE_URL}/services/${service.slug}`;
  // Create a plain text description from HTML
  const plainTextDescription = service.projectSummary
    ? service.projectSummary.replace(/<[^>]*>/g, "").substring(0, 160)
    : "Professional service offering";
  
  const featuredImage = service.images?.[0] || `${BASE_URL}/og-default-service.png`;


  return {
    title: `${service.title} - Jia Pixel Services`,
    description: plainTextDescription,
    
    // ক্যানোনিক্যাল লিংক (Self-Referencing)
    alternates: {
      canonical: currentUrl,
    },
    
    // Open Graph (OG) ট্যাগস
    openGraph: {
        title: `${service.title} | Jia Pixel Services`,
        description: plainTextDescription,
        url: currentUrl,
        type: 'website', // Fix: Changed from 'product' to 'website'
        images: [{ 
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: service.title
        }],
    },
    
    // Twitter Card ট্যাগস
    twitter: {
        card: 'summary_large_image',
        images: [featuredImage],
        title: `${service.title} | Jia Pixel Services`,
        description: plainTextDescription,
    }
  };
}


export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = params;
  const service = await getService(slug); // service এখন IService টাইপের

  if (!service) {
    notFound();
  }

  const mainCategory = service.category?.split(" > ")[0] || "Service";
  const subcategory = service.category?.split(" > ")[1] || "General Service";

  // JSON-LD Service Schema Markup (ক্লিন কোড)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.projectSummary.replace(/<[^>]*>/g, ""),
    "url": `${BASE_URL}/services/${service.slug}`,
    "serviceType": mainCategory,
    "provider": {
        "@type": "Organization",
        "name": "Jia Pixel",
        "url": BASE_URL,
    },
    ...(service.tiers?.starter?.price && {
        "offers": {
            "@type": "Offer",
            "price": service.tiers.starter.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
        }
    })
  };

  return (
    <div className="bg-background overflow-hidden py-20">
      {/* Schema Injection */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      <div className="container mx-auto px-4 w-full">
        <HeroSection
          service={service} // 'service' now includes title and images
          mainCategory={mainCategory}
          subcategory={subcategory}
        />
        
        {/* Service Description */}
        <section className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Service Details
          </h2>
          <RichTextRenderer content={service.projectSummary} />
        </section>

        {/* Author Quote Component (No more red lines!) */}
        <AuthorQuote
          author={service.author}
          authorQuote={service.authorQuote}
        />

        {/* Pricing Component - Only show if service has tiers */}
        {service.tiers && Object.keys(service.tiers).length > 0 && (
          <PricingComponent service={service} />
        )}

        <div>
          <FAQSection faqs={service.faqs} />
        </div>

        {/* Service Steps */}
        {service.projectSteps && service.projectSteps.length > 0 && (
          <ServiceSteps steps={service.projectSteps} />
        )}

        {/* Requirements */}
        {service.requirements && service.requirements.length > 0 && (
          <section className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              What I Need From You
            </h2>
            <div className="space-y-3">
              {service.requirements.map(
                (requirement: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">{requirement}</span>
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}