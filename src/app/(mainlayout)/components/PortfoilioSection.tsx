import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

const portfolioImages = [
  "/Assets/portfolios/reviews3.webp",
  "/Assets/portfolios/reviews2.webp",
  "/Assets/portfolios/reviews.webp",
  "/Assets/portfolios/whoweare.webp",
  "/Assets/portfolios/aboutus.webp",
  "/Assets/portfolios/banner4.webp",
  "/Assets/portfolios/productdeatils.webp",
  "/Assets/portfolios/login3.webp",
  "/Assets/portfolios/banner2.webp",
  "/Assets/portfolios/pricing3.webp",
  "/Assets/portfolios/dashboard2.webp",
  "/Assets/portfolios/dashboard.webp",
  "/Assets/portfolios/blog.webp",
  "/Assets/portfolios/portfolio.webp",
  "/Assets/portfolios/testimonial.webp",
  "/Assets/portfolios/pricing2.webp",
  "/Assets/portfolios/pricing.webp",
  "/Assets/portfolios/productcart.webp",
  "/Assets/portfolios/Loginbanner.webp",
  "/Assets/portfolios/Login.webp",
];

// Split images for three columns with better distribution
const firstRow = portfolioImages.slice(0, 7);
const secondRow = portfolioImages.slice(7, 14);
const thirdRow = portfolioImages.slice(14);

const PortfolioSection = () => {
  return (
    <div className="container py-16 px-4 mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Left side content */}
      <div className="flex flex-col justify-center space-y-6 md:space-y-8">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
          Our Creative
          <span className="text-primary block mt-2">Masterpieces</span>
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
          Discover our curated collection of stunning projects that showcase
          innovation, creativity, and technical excellence. Each piece tells a
          unique story of collaboration and success.
        </p>

        {/* Features list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
          <div className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            </div>
            <span className="text-foreground font-medium">
              Custom Solutions
            </span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            </div>
            <span className="text-foreground font-medium">
              Modern Tech Stack
            </span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            </div>
            <span className="text-foreground font-medium">SEO Optimized</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            </div>
            <span className="text-foreground font-medium">Ongoing Support</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 pt-4">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              50+
            </div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              100%
            </div>
            <div className="text-sm text-muted-foreground">
              Client Satisfaction
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              24/7
            </div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button className="px-8 py-3 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
            View All Projects
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            className="px-8 py-3 text-lg rounded-xl font-semibold border-2 hover:bg-accent transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Right side content with three marquees - larger images */}
      <div className="relative flex h-[350px] md:h-[600px] justify-center gap-3 rounded-4xl lg:gap-4 overflow-hidden">
        {/* First Column: Top to Bottom */}
        <Marquee
          vertical
          pauseOnHover
          className="[--duration:80s] w-48 lg:w-52"
        >
          {firstRow.map((src, index) => (
            <div key={`first-${index}`} className="group p-2">
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]">
                <Image
                  src={src}
                  alt={`Portfolio image ${index + 1}`}
                  width={380}
                  height={214}
                  className="w-full h-auto object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </Marquee>

        {/* Second Column: Bottom to Top */}
        <Marquee
          vertical
          pauseOnHover
          reverse
          className="[--duration:90s] w-48 lg:w-52"
        >
          {secondRow.map((src, index) => (
            <div key={`second-${index}`} className="group p-2">
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]">
                <Image
                  src={src}
                  alt={`Portfolio image ${index + 1 + firstRow.length}`}
                  width={380}
                  height={214}
                  className="w-full h-auto object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </Marquee>

        {/* Third Column: Top to Bottom */}
        <Marquee
          vertical
          pauseOnHover
          className="[--duration:85s] w-48 lg:w-52"
        >
          {thirdRow.map((src, index) => (
            <div key={`third-${index}`} className="group p-2">
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]">
                <Image
                  src={src}
                  alt={`Portfolio image ${
                    index + 1 + firstRow.length + secondRow.length
                  }`}
                  width={380}
                  height={214}
                  className="w-full h-auto object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </Marquee>

        {/* Enhanced Gradient Fades */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-background to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent z-10"></div>

        {/* Reduced side gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-linear-to-r from-background to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-linear-to-l from-background to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default PortfolioSection;
