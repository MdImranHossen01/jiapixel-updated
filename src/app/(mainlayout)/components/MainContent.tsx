import PortfoilioSection from "./PortfoilioSection";
import HoverServices from "./HoverServices";
import FaqSection from "./faq/FaqSection";
import AboutUsSection from "./aboutus/AboutUsSection";
import MarketingFeatures from "./MarketingFeatures";
import SEOFeatures from "./SEOFeatures";
import FeaturedProjectSection from "./FeaturedProjectSection/FeaturedProjectSection";
import BlogSection from "./BlogSection/BlogSection";

const MainContent = () => {
  return (
    <>
      < FeaturedProjectSection />
      <AboutUsSection />
      <PortfoilioSection />
      <HoverServices />

      <SEOFeatures />
      <MarketingFeatures />
      <BlogSection />
      <FaqSection />
    </>
  );
};

export default MainContent;
