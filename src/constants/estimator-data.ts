export interface PricingOption {
    id: string;
    label: string;
    price: number;
    description?: string;
}

export interface PricingCategory {
    id: string;
    title: string;
    options: PricingOption[];
    multiSelect?: boolean;
}

export const ESTIMATOR_DATA: PricingCategory[] = [
    {
        id: "project_type",
        title: "What type of project is this?",
        multiSelect: false,
        options: [
            { id: "website", label: "Business Website", price: 500, description: "5-10 pages, contact form, SEO basic" },
            { id: "ecommerce", label: "E-Commerce Store", price: 1200, description: "Product catalog, cart, payment gateway" },
            { id: "webapp", label: "Custom Web App", price: 2500, description: "User dashboard, complex logic, database" },
            { id: "landing", label: "Landing Page", price: 300, description: "High conversion single page" },
        ],
    },
    {
        id: "features",
        title: "What features do you need?",
        multiSelect: true,
        options: [
            { id: "cms", label: "CMS / Admin Panel", price: 300, description: "Manage your own content" },
            { id: "seo", label: "Advanced SEO", price: 200, description: "Keyword research, metadata optimization" },
            { id: "chat", label: "Live Chat Integration", price: 100, description: "Talk to visitors in real-time" },
            { id: "analytics", label: "Advanced Analytics", price: 150, description: "User tracking & heatmaps" },
            { id: "multilang", label: "Multi-language", price: 400, description: "Support for 2+ languages" },
        ],
    },
    {
        id: "design",
        title: "Design Complexity",
        multiSelect: false,
        options: [
            { id: "template", label: "Template Based", price: 0, description: "Clean, professional, faster delivery" },
            { id: "custom", label: "Custom UI/UX", price: 600, description: "Unique branding, animations, tailored experience" },
        ],
    },
    {
        id: "timeline",
        title: "Project Timeline",
        multiSelect: false,
        options: [
            { id: "standard", label: "Standard", price: 0, description: "Normal delivery schedule" },
            { id: "rush", label: "Rush Delivery", price: 500, description: "Priority development (+20% faster)" },
        ],
    },
];
