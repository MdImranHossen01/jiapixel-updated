import React from "react";
import {
  FiTarget,
  FiBarChart2,
  FiDollarSign,
  FiUsers,
  FiMessageCircle,
  FiTrendingUp,
  FiShare2,
  FiMail,
  FiSearch,
  FiVideo,
  FiImage,
  FiGlobe,
  FiPieChart,
  FiAward,
  FiSmartphone,
} from "react-icons/fi";

const featuresData = [
  {
    title: "Facebook Pixel Setup",
    description:
      "Track conversions, build audiences, and optimize ads with precise Facebook Pixel implementation.",
    icon: <FiTarget className="w-8 h-8" />,
  },
  {
    title: "Google Ads Campaigns",
    description:
      "Strategic PPC campaigns with keyword optimization, ad copy, and conversion tracking.",
    icon: <FiDollarSign className="w-8 h-8" />,
  },
  {
    title: "Meta Ads Management",
    description:
      "Complete Facebook & Instagram ad management with audience targeting and creative optimization.",
    icon: <FiUsers className="w-8 h-8" />,
  },
  {
    title: "Conversion Tracking",
    description:
      "Set up and monitor key conversion events across all platforms for ROI measurement.",
    icon: <FiBarChart2 className="w-8 h-8" />,
  },
  {
    title: "Social Media Marketing",
    description:
      "Organic growth strategies and paid campaigns across all major social platforms.",
    icon: <FiShare2 className="w-8 h-8" />,
  },
  {
    title: "Email Marketing",
    description:
      "Automated email campaigns, newsletter design, and subscriber management systems.",
    icon: <FiMail className="w-8 h-8" />,
  },
  {
    title: "SEO Strategy",
    description:
      "Comprehensive SEO including technical optimization, content strategy, and link building.",
    icon: <FiSearch className="w-8 h-8" />,
  },
  {
    title: "Content Marketing",
    description:
      "Strategic content creation including blogs, videos, and social media content.",
    icon: <FiTrendingUp className="w-8 h-8" />,
  },
  {
    title: "Video Marketing",
    description:
      "YouTube optimization, video ads, and engaging video content for social media.",
    icon: <FiVideo className="w-8 h-8" />,
  },
  {
    title: "Influencer Marketing",
    description:
      "Identify and collaborate with relevant influencers to amplify your brand reach.",
    icon: <FiMessageCircle className="w-8 h-8" />,
  },
  {
    title: "Google Analytics Setup",
    description:
      "Complete GA4 implementation with custom events, goals, and e-commerce tracking.",
    icon: <FiPieChart className="w-8 h-8" />,
  },
  {
    title: "Retargeting Campaigns",
    description:
      "Win back lost customers with strategic retargeting across multiple platforms.",
    icon: <FiGlobe className="w-8 h-8" />,
  },
  {
    title: "Ad Creative Design",
    description:
      "Eye-catching ad creatives, banners, and social media visuals that convert.",
    icon: <FiImage className="w-8 h-8" />,
  },
  {
    title: "Mobile Advertising",
    description:
      "Optimized mobile ad campaigns for in-app and mobile web experiences.",
    icon: <FiSmartphone className="w-8 h-8" />,
  },
  {
    title: "ROI Optimization",
    description:
      "Continuous campaign optimization to maximize return on advertising spend.",
    icon: <FiAward className="w-8 h-8" />,
  },
];

const MarketingFeatures = () => {
  return (
    // Section container using theme colors (assuming dark/high-contrast background)
    <section className="text-foreground py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional <span className="text-primary">Digital Marketing</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Data-driven marketing strategies and advanced SEO techniques that
            increase visibility, drive qualified traffic, and deliver measurable
            business growth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-10 md:gap-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 text-center 
                                transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg hover:border-primary"
            >
              <div className="flex justify-center mb-3 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-card-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {feature.description.split(" ").slice(0, 5).join(" ")}...
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketingFeatures;
