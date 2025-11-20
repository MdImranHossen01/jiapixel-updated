import PortfoilioSection from "./PortfoilioSection";
import HoverServices from "./HoverServices";
import FaqSection from "./faq/FaqSection";
import AboutUsSection from "./aboutus/AboutUsSection";
import MarketingFeatures from "./MarketingFeatures";
import SEOFeatures from "./SEOFeatures";

const MainContent = () => {
  return (
    <>
      <AboutUsSection />
      <PortfoilioSection />
      <HoverServices />

      <SEOFeatures />
      <MarketingFeatures />
      <FaqSection />
    </>
  );
};

export default MainContent;
