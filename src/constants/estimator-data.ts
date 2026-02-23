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
    dependsOn?: Record<string, string[]>;
}

export const ESTIMATOR_DATA: PricingCategory[] = [
    {
        id: "service_type",
        title: "What service are you looking for?",
        multiSelect: false,
        options: [
            { id: "web_development", label: "Web Development", price: 0, description: "Custom websites, web apps, ecommerce" },
            { id: "seo", label: "Search Engine Optimization (SEO)", price: 0, description: "Rank higher on Google, Bing" },
            { id: "ads_campaign", label: "Ads Campaign", price: 0, description: "Google Ads, Facebook Ads" },
            { id: "social_media", label: "Social Media Management", price: 0, description: "Content creation & community management" },
            { id: "Youtube-Growth", label: "YouTube Views & Subscriber Growth", price: 0, description: "Watch time, subscribers & SEO management" },
            { id: "Social Media Growth", label: "Social Media Organic Growth", price: 0, description: "Followers, likes & engagement boost" },
        ],
    },
    // Web Development Branch
    {
        id: "project_type",
        title: "What type of project is this?",
        multiSelect: false,
        dependsOn: { "service_type": ["web_development"] },
        options: [
            { id: "website", label: "Business Website", price: 350, description: "5-10 pages, contact form, SEO basic" },
            { id: "ecommerce", label: "E-Commerce Store", price: 500, description: "Product catalog, cart, payment gateway" },
            { id: "webapp", label: "Custom Web App", price: 2000, description: "User dashboard, complex logic, database" },
            { id: "landing", label: "Landing Page", price: 200, description: "High conversion single page" },
        ],
    },
    {
        id: "features",
        title: "What features do you need?",
        multiSelect: true,
        dependsOn: { "service_type": ["web_development"] },
        options: [
            { id: "cms", label: "CMS / Admin Panel", price: 100, description: "Manage your site's content effortlessly" },
            { id: "seo_basic", label: "Basic On-page SEO", price: 150, description: "Keyword research & metadata optimization" },
            { id: "chat", label: "Live Chat Integration", price: 100, description: "Engage with visitors in real-time" },
            { id: "AI", label: "AI Chatbot Integration", price: 150, description: "Automated 24/7 customer support" },
            { id: "google_integration", label: "Google Toolset Setup", price: 50, description: "Search Console, Tag Manager & Analytics" },
            { id: "facebook_integration", label: "Meta (Facebook) Pixel", price: 50, description: "Track conversions & build audiences" },
            { id: "microsoft_clarity", label: "Microsoft Clarity", price: 50, description: "Behavior tracking with heatmaps & session recordings" },
            { id: "analytics", label: "Advanced Analytics", price: 150, description: "Deep dive into custom user events & tracking" },
            { id: "multilang", label: "Multi-language Support", price: 200, description: "Expand reach with 2+ languages" },
        ],
    },
    {
        id: "design",
        title: "Design Complexity",
        multiSelect: false,
        dependsOn: { "service_type": ["web_development"] },
        options: [
            { id: "template", label: "Template Based", price: 0, description: "Clean, professional, faster delivery" },
            { id: "custom", label: "Custom UI/UX", price: 600, description: "Unique branding, animations, tailored experience" },
        ],
    },

    // SEO Branch
    {
        id: "seo_type",
        title: "What type of SEO do you need?",
        multiSelect: false,
        dependsOn: { "service_type": ["seo"] },
        options: [
            { id: "local_seo", label: "Local SEO", price: 300, description: "Google My Business, local citations" },
            { id: "national_seo", label: "National/Global SEO", price: 800, description: "Broad keyword targeting" },
            { id: "ecommerce_seo", label: "E-Commerce SEO", price: 1000, description: "Product optimization, category targeting" },
        ],
    },
    {
        id: "seo_duration",
        title: "Monthly Commitment",
        multiSelect: false,
        dependsOn: { "service_type": ["seo"] },
        options: [
            { id: "month_1", label: "1 Month (Audit & Setup)", price: 200, description: "One-time fix and strategy" },
            { id: "month_3", label: "3 Months", price: 0, description: "Standard engagement" },
            { id: "month_6", label: "6 Months+", price: 0, description: "Long-term growth focus" },
        ]
    },

    // Ads Branch
    {
        id: "ads_platform",
        title: "Which platforms?",
        multiSelect: true,
        dependsOn: { "service_type": ["ads_campaign"] },
        options: [
            { id: "google_ads", label: "Google Ads", price: 400, description: "Search & Display network" },
            { id: "meta_ads", label: "Facebook & Instagram", price: 300, description: "Social media reach" },
            { id: "linkedin_ads", label: "LinkedIn Ads", price: 400, description: "B2B targeting" },
            { id: "tiktok_ads", label: "TikTok Ads", price: 300, description: "Gen Z & short-form video" },
        ]
    },
    {
        id: "ad_creative",
        title: "Do you need ad creatives?",
        multiSelect: false,
        dependsOn: { "service_type": ["ads_campaign"] },
        options: [
            { id: "have_creatives", label: "I have my own", price: 0, description: "Images/videos already prepared" },
            { id: "need_images", label: "Image Creatives", price: 200, description: "We create banners and ad images" },
            { id: "need_video", label: "Video Creatives", price: 500, description: "We shoot/edit short-form videos" },
        ]
    },

    // Social Media Branch
    {
        id: "social_platforms",
        title: "Which platforms to manage?",
        multiSelect: true,
        dependsOn: { "service_type": ["social_media"] },
        options: [
            { id: "fb_ig", label: "Facebook & Instagram", price: 400, description: "3 posts a week" },
            { id: "linkedin", label: "LinkedIn", price: 300, description: "2 posts a week" },
            { id: "twitter", label: "Twitter / X", price: 200, description: "5 tweets a week" },
            { id: "tiktok", label: "TikTok", price: 600, description: "3 short videos a week" },
        ]
    },

    // Social Media Organic Growth Branch
    {
        id: "social_growth_services",
        title: "Monthly Organic Growth Services",
        multiSelect: true,
        dependsOn: { "service_type": ["Social Media Growth"] },
        options: [
            { id: "growth_ig", label: "1,000+ Instagram Followers/Likes", price: 100, description: "100% organic worldwide growth" },
            { id: "growth_fb", label: "1,000+ Facebook Followers/Likes", price: 100, description: "100% organic worldwide growth" },
            { id: "growth_tw", label: "1,000+ Twitter/X Followers/Likes", price: 100, description: "100% organic worldwide growth" },
            { id: "growth_tt", label: "1,000+ TikTok Followers/Likes", price: 100, description: "100% organic worldwide growth" },
        ]
    },

    // YouTube Growth Branch
    // YouTube Growth Branch
    {
        id: "youtube_services",
        title: "Channel Goals & Management",
        multiSelect: true,
        dependsOn: { "service_type": ["Youtube-Growth"] },
        options: [
            { id: "yt_watch_time", label: "4000 Hours Watch Time", price: 1000, description: "Achieve the YouTube Partner Program threshold" },
            { id: "yt_subs", label: "1,000 Subscribers", price: 250, description: "Boost your channel credibility instantly" },
            { id: "yt_monthly_pkg", label: "100k Views + 2-5% Subs Growth", price: 200, description: "Consistent organic views and engagement monthly" },
            { id: "yt_seo_mgmt", label: "Channel Management & SEO", price: 150, description: "Video optimization, keyword targeting & strategy" },
        ]
    },
    {
        id: "youtube_thumbnails",
        title: "Thumbnail Design",
        multiSelect: false,
        dependsOn: { "service_type": ["Youtube-Growth"] },
        options: [
            { id: "yt_thumb_none", label: "I have my own thumbnails", price: 0, description: "Ready to upload" },
            { id: "yt_thumb_1", label: "1 Custom Thumbnail", price: 15, description: "High CTR eye-catching design (Per video)" },
            { id: "yt_thumb_4", label: "4 Custom Thumbnails / Month", price: 60, description: "Perfect for weekly uploaders" },
            { id: "yt_thumb_8", label: "8 Custom Thumbnails / Month", price: 120, description: "For twice-a-week uploaders" },
        ]
    },

    // Timeline (Common)
    {
        id: "timeline",
        title: "Project Timeline / Urgency",
        multiSelect: false,
        options: [
            { id: "standard", label: "Standard", price: 0, description: "Normal schedule" },
            { id: "rush", label: "Rush Priority", price: 300, description: "Started immediately (extra cost)" },
        ],
    },
];
