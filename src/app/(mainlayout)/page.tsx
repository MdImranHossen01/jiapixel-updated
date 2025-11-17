

import HowWeWork from "./components/HowWeWork";
import WebFeatures from "./components/WebFeatures";
import WhyChooseUs from "./components/whyChooseUs";

const HomePage = () => {
  return (
    <div>
      {/* <Banner/> */}
       {/* <PortfoilioSection/> */}
       {/* <HoverServices/> */}
      <HowWeWork/>
      <WhyChooseUs/>
      <WebFeatures/>
    </div>
  );
};

export default HomePage;
