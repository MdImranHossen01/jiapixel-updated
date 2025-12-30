import React from "react";

import {
  Target,
  BarChart2,
  DollarSign,
  Users,
  MessageCircle,
  TrendingUp,
  Share2,
  Mail,
  Search,
  Video,
  Image as LucideImage,
  Globe,
  PieChart,
  Award,
  Smartphone,
} from "lucide-react";

const featuresData = [
  {
    title: "Facebook Pixel Setup",
    description:
      "Track conversions, build audiences, and optimize ads with precise Facebook Pixel implementation.",
    icon: <Target className="w-8 h-8" />,
  },
  {
    title: "Google Ads Campaigns",
    description:
      "Strategic PPC campaigns with keyword optimization, ad copy, and conversion tracking.",
    icon: <DollarSign className="w-8 h-8" />,
  },
  {
    title: "Meta Ads Management",
    description:
      "Complete Facebook & Instagram ad management with audience targeting and creative optimization.",
    icon: <Users className="w-8 h-8" />,
  },
  {
    title: "Conversion Tracking",
    description:
      "Set up and monitor key conversion events across all platforms for ROI measurement.",
    icon: <BarChart2 className="w-8 h-8" />,
  },
  {
    title: "Social Media Marketing",
    description:
      "Organic growth strategies and paid campaigns across all major social platforms.",
    icon: <Share2 className="w-8 h-8" />,
  },
  {
    title: "Email Marketing",
    description:
      "Automated email campaigns, newsletter design, and subscriber management systems.",
    icon: <Mail className="w-8 h-8" />,
  },
  {
    title: "SEO Strategy",
    description:
      "Comprehensive SEO including technical optimization, content strategy, and link building.",
    icon: <Search className="w-8 h-8" />,
  },
  {
    title: "Content Marketing",
    description:
      "Strategic content creation including blogs, videos, and social media content.",
    icon: <TrendingUp className="w-8 h-8" />,
  },
  {
    title: "Video Marketing",
    description:
      "YouTube optimization, video ads, and engaging video content for social media.",
    icon: <Video className="w-8 h-8" />,
  },
  {
    title: "Influencer Marketing",
    description:
      "Identify and collaborate with relevant influencers to amplify your brand reach.",
    icon: <MessageCircle className="w-8 h-8" />,
  },
  {
    title: "Google Analytics Setup",
    description:
      "Complete GA4 implementation with custom events, goals, and e-commerce tracking.",
    icon: <PieChart className="w-8 h-8" />,
  },
  {
    title: "Retargeting Campaigns",
    description:
      "Win back lost customers with strategic retargeting across multiple platforms.",
    icon: <Globe className="w-8 h-8" />,
  },
  {
    title: "Ad Creative Design",
    description:
      "Eye-catching ad creatives, banners, and social media visuals that convert.",
    icon: <LucideImage className="w-8 h-8" />,
  },
  {
    title: "Mobile Advertising",
    description:
      "Optimized mobile ad campaigns for in-app and mobile web experiences.",
    icon: <Smartphone className="w-8 h-8" />,
  },
  {
    title: "ROI Optimization",
    description:
      "Continuous campaign optimization to maximize return on advertising spend.",
    icon: <Award className="w-8 h-8" />,
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
