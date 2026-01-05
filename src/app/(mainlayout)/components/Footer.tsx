import React from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { GoogleIcon, WhatsappIcon } from "@/components/CustomIcons";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        {
          name: "Book A meeting",
          href: "https://meet.google.com/qnu-vfvg-qnf",
        },
        { name: "Review Us", href: "https://g.page/r/CWA1sOPE9QeJEBM/review" },
        { name: "Blogs", href: "/blogs" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Web Development", href: "/services" },
        { name: "Mobile Apps", href: "/services" },
        { name: "UI/UX Design", href: "/services" },
        { name: "Digital Marketing", href: "/services" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Refund Policy", href: "/refund-policy" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <GoogleIcon className="text-xl" />,
      href: "https://business.google.com/n/10330903490487912460/profile?fid=9874130934015472992",
      label: "Google Business",
    },
    {
      icon: <Github className="w-5 h-5" />, // matched size to typical xl or lucide default
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
    <footer className="text-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs">
              Creating exceptional digital experiences that drive growth and
              innovation for businesses worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  prefetch={false}
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col justify-center items-center space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Nabokalosh, Matlab Dakkhin, Chandpur</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+8801919011101</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>mail.jiapixel@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center text-muted-foreground">
          <p>&copy; {currentYear} Jiapixel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
