import React from "react";
import Link from "next/link";
import {
  FaGithub,
  FaWhatsapp,
  FaGoogle,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Web Development", href: "/services/web-development" },
        { name: "Mobile Apps", href: "/services/mobile-apps" },
        { name: "UI/UX Design", href: "/services/ui-ux-design" },
        { name: "Digital Marketing", href: "/services/digital-marketing" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <FaGoogle className="text-xl" />,
      href: "https://business.google.com/n/10330903490487912460/profile?fid=9874130934015472992",
      label: "Google Business",
    },
    {
      icon: <FaGithub className="text-xl" />,
      href: "https://github.com/MdImranHossen01",
      label: "GitHub",
    },

    {
      icon: <FaLinkedin className="text-xl" />,
      href: "https://www.linkedin.com/in/expert-full-stack-web-applications-developer-in-bangladesh-md-imran-hossen/",
      label: "LinkedIn",
    },

    {
      icon: <FaWhatsapp className="text-xl" />,
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-0">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <FaMapMarkerAlt />
                <span>123 Business Ave, Suite 100, New York, NY 10001</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <FaPhone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <FaEnvelope />
                <span>contact@jiapixel.com</span>
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
