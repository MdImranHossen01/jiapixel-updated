// G:\jiapixel-updated\src\app\(mainlayout)\services\components\FeaturedCard.tsx
import React from "react";
import { CheckCircle, Zap, Shield, Clock, Users, Globe } from "lucide-react";

const FeaturedCard = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with regular updates and maintenance",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock technical support and maintenance services",
    },

    {
      icon: <Globe className="w-6 h-6" />,
      title: "Scalable Solutions",
      description:
        "Built to grow with your business and handle increasing traffic",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Quality Assured",
      description: "Rigorous testing and quality assurance processes",
    },
  ];

  return (
    <section className=" w-full max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
              Our Service Features
            </h2>
     <div className="grid grid-cols-2 gap-6">
         {features.map((feature, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30 group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {feature.icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
     </div>
    </section>
  );
};

export default FeaturedCard;
