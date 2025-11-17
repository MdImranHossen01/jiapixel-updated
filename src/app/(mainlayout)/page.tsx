

import Banner from "./components/Banner";
import HoverServices from "./components/HoverServices";
import HowWeWork from "./components/HowWeWork";
import PortfoilioSection from "./components/PortfoilioSection";
import WebFeatures from "./components/WebFeatures";
import WhyChooseUs from "./components/whyChooseUs";

const HomePage = () => {
  return (
    <div>
      <Banner/>
       {/* <PortfoilioSection/> */}
       <HoverServices/>
      <HowWeWork/>
      <WhyChooseUs/>
      <WebFeatures/>
    </div>
  );
};

export default HomePage;
