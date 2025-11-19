

import Banner from "./components/banner/Banner";
import FaqSection from "./components/faq/FaqSection";
import HoverServices from "./components/HoverServices";
import PortfoilioSection from "./components/PortfoilioSection";
import WebFeatures from "./components/WebFeatures";
import WhyChooseUs from "./components/whyChooseUs";

const HomePage = () => {
  return (
    <div>
      <Banner/>
       <PortfoilioSection/>
       <HoverServices/>
      <WhyChooseUs/>
      <WebFeatures/>
   <FaqSection/>
    </div>
  );
};

export default HomePage;
