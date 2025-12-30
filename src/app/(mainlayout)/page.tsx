import { Suspense } from 'react';
import Banner from "./components/banner/Banner";
import { FAQ_DATA } from "./components/faq/constants";

// Group components that appear together
import MainContent from "./components/MainContent";

// Loading component
const LoadingFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const HomePage = () => {
  // Generate FAQ structured data for homepage
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div>
      {/* FAQ Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      {/* Banner is critical - load immediately */}
      <Banner />

      {/* Lazy load the rest of the content */}
      <Suspense fallback={<LoadingFallback />}>
        <MainContent />
      </Suspense>
    </div>
  );
};

export default HomePage;