import type { GridFeature } from "./components/FeaturesGrid";

export const features: GridFeature[] = [
  {
    name: "Image Generator",
    description: "Generate stunning images from text prompts. Free tier uses Pollinations.ai — unlimited. Pro unlocks DALL-E 3 HD quality.",
    emoji: "🖼️",
    href: "/tools/image",
    size: "large",
  },
  {
    name: "Product Description",
    description: "Write compelling ecommerce copy that converts. Choose tone, language, and style.",
    emoji: "🛍️",
    href: "/tools/product-desc",
    size: "medium",
  },
  {
    name: "SEO Meta Generator",
    description: "Optimized titles, descriptions & keywords for any page. Get more organic traffic.",
    emoji: "🔍",
    href: "/tools/seo-meta",
    size: "medium",
  },
  {
    name: "Social Caption Writer",
    description: "Platform-perfect captions with hashtags for Instagram, Twitter, LinkedIn, TikTok, and more.",
    emoji: "📱",
    href: "/tools/social-caption",
    size: "small",
  },
  {
    name: "Code Explainer",
    description: "Paste any code — get a clear explanation in plain English. Great for learning and code reviews.",
    emoji: "💻",
    href: "/tools/code-explainer",
    size: "small",
  },
  {
    name: "Text Summarizer",
    description: "Condense long articles, reports, and documents into clear key points.",
    emoji: "📄",
    href: "/tools/summarizer",
    size: "small",
  },
  {
    name: "Blog Writer",
    description: "Generate full SEO-structured blog posts from a topic. 500 to 2000+ words with H2 sections.",
    emoji: "✍️",
    href: "/tools/blog-writer",
    size: "small",
  },
  {
    name: "Free. Unlimited. Always.",
    description: "Our free tier runs on Groq's Llama 3.3 70B (text) and Pollinations.ai (images) — both completely free. You get real AI, not a watered-down demo.",
    emoji: "⚡",
    href: "/tools",
    size: "medium",
  },
  {
    name: "Pro = GPT-4o Quality",
    description: "Upgrade for GPT-4o powered generation, DALL-E 3 HD images, longer outputs, bulk generation, and API access.",
    emoji: "👑",
    href: "/pricing",
    size: "medium",
  },
];

export const testimonials = [
  {
    name: "Sarah K.",
    role: "Ecommerce Store Owner",
    avatarSrc: "https://i.pravatar.cc/150?img=47",
    socialUrl: "#",
    quote: "I write product descriptions for 200+ SKUs. GenKit's free tier saves me hours every week — and the quality is genuinely impressive.",
  },
  {
    name: "Marcus T.",
    role: "Freelance Developer",
    avatarSrc: "https://i.pravatar.cc/150?img=11",
    socialUrl: "#",
    quote: "The code explainer is my secret weapon. I paste unfamiliar code and get instant clarity. Unlimited on the free tier — unbeatable.",
  },
  {
    name: "Priya M.",
    role: "Content Marketer",
    avatarSrc: "https://i.pravatar.cc/150?img=32",
    socialUrl: "#",
    quote: "SEO meta generator + social caption writer together cut my content workflow in half. Upgraded to Pro after day one.",
  },
];

export const faqs = [
  {
    id: 1,
    question: "Is the free tier really unlimited?",
    answer: "Yes. Free tier text tools run on Groq's Llama 3.3 70B API (14,400 requests/day pool) and image generation uses Pollinations.ai (unlimited). There are no daily caps on your account — it's genuinely free and unlimited for normal use.",
    href: "/tools",
  },
  {
    id: 2,
    question: "What does Pro add over Free?",
    answer: "Pro upgrades you to GPT-4o for text (significantly better quality, longer outputs, more nuanced writing) and DALL-E 3 HD for images. You also unlock Blog Writer, bulk generation, and priority processing.",
    href: "/pricing",
  },
  {
    id: 3,
    question: "Do I need a credit card to sign up?",
    answer: "No credit card needed for the free tier. Sign up with just your email and start generating immediately.",
    href: "/signup",
  },
  {
    id: 4,
    question: "How does image generation work on the free tier?",
    answer: "Free images are generated via Pollinations.ai using the Flux model. First generation may take 5–15 seconds. Quality is good for most use cases. Pro tier uses OpenAI DALL-E 3 with HD quality and faster generation.",
    href: "/tools/image",
  },
  {
    id: 5,
    question: "Can I use GenKit for commercial projects?",
    answer: "Yes. Generated content is yours to use commercially. Check the terms of the underlying AI providers (OpenAI, Groq, Pollinations) for any specific restrictions.",
    href: "#",
  },
];

export const footerNavigation = {
  app: [
    { name: "Tools", href: "/tools" },
    { name: "Pricing", href: "/pricing" },
    { name: "Sign Up", href: "/signup" },
    { name: "Login", href: "/login" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

export const examples = [];
