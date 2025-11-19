export enum FAQCategory {
  GENERAL = "General",
  WEB_DEVELOPMENT = "Web Development",
  SEO_MARKETING = "SEO & Marketing",
  TECHNICAL = "Technical",
  PRICING_BILLING = "Pricing & Billing"
}

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}