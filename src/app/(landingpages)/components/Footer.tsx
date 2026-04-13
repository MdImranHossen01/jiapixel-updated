import React from "react";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { GoogleIcon, WhatsappIcon } from "@/components/CustomIcons";
import Logo from "../../(mainlayout)/components/Logo";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <GoogleIcon className="text-xl" />,
      href: "https://business.google.com/n/10330903490487912460/profile?fid=9874130934015472992",
      label: "Google Business",
    },
    {
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/MdImranHossen01",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com/in/expert-full-stack-web-applications-developer-in-bangladesh-md-imran-hossen/",
      label: "LinkedIn",
    },
    {
      icon: <WhatsappIcon className="text-xl" />,
      href: "https://wa.me/8801919011101",
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="text-foreground border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-8 md:space-y-0">
          {/* Logo & Meta Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Logo showText={true} />
            <p className="text-muted-foreground max-w-xs text-sm">
              Creating exceptional digital experiences that drive growth and
              innovation for businesses worldwide.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-6">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                aria-label={social.label}
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; {currentYear} Jiapixel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
