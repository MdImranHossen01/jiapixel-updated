import PortfoilioSection from "./PortfoilioSection";
import HoverServices from "./HoverServices";
import WhyChooseUs from "./whyChooseUs";
import WebFeatures from "./WebFeatures";
import FaqSection from "./faq/FaqSection";
import AboutUsSection from "./aboutus/AboutUsSection";

const MainContent = () => {
  return (
    <>
      <AboutUsSection />
      <PortfoilioSection />
      <HoverServices />

      <WhyChooseUs />
      <WebFeatures />
      <FaqSection />
    </>
  );
};

export default MainContent;
