import PortfoilioSection from "./PortfoilioSection";
import HoverServices from "./HoverServices";
import FaqSection from "./faq/FaqSection";
import AboutUsSection from "./aboutus/AboutUsSection";
import MarketingFeatures from "./MarketingFeatures";
import SEOFeatures from "./SEOFeatures";
import FeaturedProjectSection from "./FeaturedProjectSection/FeaturedProjectSection";
import WritingSection from "./WritingSection/WritingSection";

const MainContent = async () => {
  return (
    <>
      <FeaturedProjectSection />
      <AboutUsSection />
      <PortfoilioSection />
      <HoverServices />
      <SEOFeatures />
      <MarketingFeatures />
      <WritingSection />
      <FaqSection />
    </>
  );
};

export default MainContent;
