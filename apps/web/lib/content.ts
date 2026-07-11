export const siteConfig = {
  name: "Fonex Supply Limited",
  tagline: "Premier mobile technology supplier in East Africa",
  address: "Mogadishu, Somalia",
  phone: "772000043",
  email: "info@fonexsupply.com",
  website: "www.fonexsupply.com",
  established: "2025",
  copyright: "© 2026 Fonex Supply Limited. All rights reserved.",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products & Services", href: "/products" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "News", href: "/news" },
  { label: "Why Fonex", href: "/why-fonex" },
  { label: "Contact", href: "/contact" },
];

// Homepage "Featured Devices" slider — manufacturer marketing banners for
// devices we supply. Each banner already has its own text/specs baked in,
// so no separate caption is rendered on top of these.
export const featuredDevices = [
  {
    img: "/images/335fd095268330e06ec71c1d7a235135.png",
    alt: "Classic A07 — 13MP+8MP camera, 6.6\" 90Hz display, 12GB+128GB",
  },
  {
    img: "/images/348cecd1d208ec2eb74ea3474ca9e234 (1).png",
    alt: "A16 Plus — innovative design, now available",
  },
  {
    img: "/images/48c240e998501d89cd853aa67b4b1ff1 (1).jpg.jpeg",
    alt: "KXD A5 — HD screen, 6.88\", 50MP camera, 5000mAh battery",
  },
  {
    img: "/images/58a46ac54216d4f22c5c8c03c86735b7 (1).png",
    alt: "S25 Plus — super clear large screen smartphone",
  },
  {
    img: "/images/72c8346edeae6171735c8368447e89f6.jpg.jpeg",
    alt: "KXD A17 Plus — HD screen, 50MP+8MP camera, 4500mAh battery",
  },
  {
    img: "/images/9381c6c66daac4dc9813e098d4d2808e.png",
    alt: "KXD 15C — 6.88\" HD screen, 50MP camera, 5000mAh battery",
  },
  {
    img: "/images/ad182151dad7ee8360953fd3abaa5b09.png",
    alt: "Classic 13C — 6.8\" HD+ display, 13MP+8MP AI camera, 90Hz",
  },
  {
    img: "/images/a577b9b7363be3ac24c83a990fc8f34d.png",
    alt: "A16 Plus — innovative design, available now",
  },
];

export const services = [
  {
    title: "Flagship Smartphones",
    body: "The latest premium devices from leading global brands — authentic, sealed, and warranty-backed.",
    accent: "#1A1C74",
    tint: "#EEF1FB",
    icon: "phone",
  },
  {
    title: "Mid-Range Devices",
    body: "Dependable, affordable smartphones that bring connectivity within reach for everyone.",
    accent: "#F5A623",
    tint: "#E6F8FA",
    icon: "layers",
  },
  {
    title: "Essential Accessories",
    body: "Chargers, earphones, protective cases and more — the everyday essentials that keep devices running.",
    accent: "#F5A623",
    tint: "#EFEDFC",
    icon: "headphones",
  },
  {
    title: "Smart Wearables",
    body: "Smartwatches and connected devices for the modern, mobile-first digital lifestyle.",
    accent: "#F5A623",
    tint: "#FFF4E0",
    icon: "watch",
  },
  {
    title: "Spare Parts",
    body: "Genuine replacement components for long-term reliability and easy repairs.",
    accent: "#1A1C74",
    tint: "#EEF1FB",
    icon: "wrench",
  },
  {
    title: "After-Sales Support",
    body: "Reliable service and guidance after every purchase — trust that lasts beyond the sale.",
    accent: "#F5A623",
    tint: "#E6F8FA",
    icon: "check-circle",
  },
];

export const coreValues = [
  {
    title: "Integrity",
    body: "Transparent and ethical business practices in every transaction.",
    tint: "#EEF1FB",
    accent: "#1A1C74",
    icon: "shield",
  },
  {
    title: "Innovation",
    body: "Continually adapting to new technologies and market trends.",
    tint: "#FFF4E0",
    accent: "#F59300",
    icon: "lightbulb",
  },
  {
    title: "Customer Focus",
    body: "Prioritizing client satisfaction and long-term trust.",
    tint: "#E6F8FA",
    accent: "#F5A623",
    icon: "users",
  },
  {
    title: "Reliability",
    body: "Consistent delivery and dependable product quality, every time.",
    tint: "#EFEDFC",
    accent: "#F5A623",
    icon: "check",
  },
  {
    title: "Partnership",
    body: "Building strong collaborations with suppliers and clients.",
    tint: "#EEF1FB",
    accent: "#1A1C74",
    icon: "handshake",
  },
  {
    title: "Sustainability",
    body: "Promoting responsible practices that benefit society and the environment.",
    tint: "#E6F8FA",
    accent: "#F5A623",
    icon: "leaf",
  },
];

export const milestones = [
  {
    tag: "2025 · LAUNCH",
    text: "Established as one of Somalia's first dedicated mobile supply companies.",
  },
  {
    tag: "YEAR ONE",
    text: "Expanded distribution networks across major Somali cities.",
  },
  {
    tag: "PARTNERSHIPS",
    text: "Secured partnerships with international smartphone manufacturers.",
  },
  {
    tag: "COMMUNITY",
    text: "Launched customer education programs to promote digital inclusion.",
  },
];

export type DeviceType =
  "phone" | "watch" | "charger" | "earbuds" | "case" | "screen" | "battery";

export type ColorFamily = {
  bgA: string;
  bgB: string;
  g1: string;
  g2: string;
};

export const colorFamilies: Record<string, ColorFamily> = {
  blue: { bgA: "#EAF0FF", bgB: "#DCE6FF", g1: "#1A1C74", g2: "#3A3EAE" },
  violet: { bgA: "#E7EAFA", bgB: "#D6DBF4", g1: "#12144F", g2: "#2A2C86" },
  cyan: { bgA: "#FFF6E6", bgB: "#FFEDC9", g1: "#F5A623", g2: "#F5B84E" },
  teal: { bgA: "#EEF1FB", bgB: "#DEE4F6", g1: "#3A3EAE", g2: "#5A5FC8" },
  amber: { bgA: "#FFF6E6", bgB: "#FFEDC9", g1: "#F5A623", g2: "#F59300" },
  slate: { bgA: "#EEF1F6", bgB: "#E2E7F0", g1: "#5B6680", g2: "#7B8499" },
};

const COLOR_FAMILY_KEYS = Object.keys(colorFamilies);

export function colorFamilyForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return COLOR_FAMILY_KEYS[hash % COLOR_FAMILY_KEYS.length];
}

export const partnerPillars = [
  {
    title: "Global Manufacturers",
    tag: "GLOBAL SOURCING",
    accent: "#1A1C74",
    tint: "#EEF1FB",
    body: "Ensuring authentic, high-quality smartphones and accessories sourced directly from the world's leading brands.",
    icon: "globe",
  },
  {
    title: "Local Retailers",
    tag: "REGIONAL NETWORK",
    accent: "#F5A623",
    tint: "#E6F8FA",
    body: "Supporting Somali businesses with reliable stock and competitive pricing to help them serve their customers and grow.",
    icon: "store",
  },
  {
    title: "Technology Providers",
    tag: "LOGISTICS & IT",
    accent: "#F5A623",
    tint: "#EFEDFC",
    body: "Partnering with logistics and IT firms to enhance efficiency and reliability across our supply chain.",
    icon: "server",
  },
  {
    title: "Community Organizations",
    tag: "SOCIAL IMPACT",
    accent: "#F5A623",
    tint: "#FFF4E0",
    body: "Collaborating on digital inclusion projects that bring technology and opportunity to students and entrepreneurs.",
    icon: "heart",
  },
];

export const partnerBenefits = [
  {
    title: "Authentic Products",
    body: "Genuine devices, sourced direct — never grey-market.",
  },
  {
    title: "Competitive Pricing",
    body: "Fair wholesale rates that protect your margins.",
  },
  {
    title: "Reliable Delivery",
    body: "Consistent, dependable supply you can plan around.",
  },
  {
    title: "After-Sales Support",
    body: "Spare parts and service that build customer trust.",
  },
  {
    title: "Transparent Dealing",
    body: "Honest, ethical business in every transaction.",
  },
  {
    title: "Long-Term Focus",
    body: "We invest in partnerships, not one-off sales.",
  },
];

export const reasons = [
  {
    title: "Authentic, Guaranteed",
    body: "Every product is genuine and sourced directly from global brands.",
    tint: "#EEF1FB",
    accent: "#1A1C74",
    icon: "shield-check",
  },
  {
    title: "Regional Reach",
    body: "Reliable distribution across major Somali cities and beyond.",
    tint: "#E6F8FA",
    accent: "#F5A623",
    icon: "map-pin",
  },
  {
    title: "Fair Pricing",
    body: "Competitive, transparent rates for customers and partners alike.",
    tint: "#EFEDFC",
    accent: "#F5A623",
    icon: "tag",
  },
  {
    title: "Support That Lasts",
    body: "Spare parts and after-sales service long after the purchase.",
    tint: "#FFF4E0",
    accent: "#F59300",
    icon: "life-buoy",
  },
];

export const diffPoints = [
  "Genuine products, sourced directly from global brands",
  "Competitive, transparent pricing for partners and customers",
  "Dependable distribution across major Somali cities",
  "Spare parts and after-sales support that last",
];

export const faqs = [
  {
    q: "Are your products genuine?",
    a: "Yes — every device and accessory we supply is authentic, sourced directly from leading global manufacturers, and quality-checked before distribution.",
  },
  {
    q: "Do you sell to retailers and businesses?",
    a: "Absolutely. We supply both individual customers and business partners, with competitive wholesale pricing and reliable stock for retailers.",
  },
  {
    q: "Which areas do you serve?",
    a: "Based in Mogadishu, Somalia, we distribute across major Somali cities and are steadily expanding our reach across East Africa.",
  },
  {
    q: "Do you offer after-sales support and spare parts?",
    a: "Yes. We provide genuine spare parts and dependable after-sales support to keep devices running long after purchase.",
  },
  {
    q: "How do I request a quote or place an order?",
    a: "Reach out through our Contact page or by phone. Tell us what you need and we'll respond with availability and pricing.",
  },
];

export const contactInfo = [
  { label: "Visit us", value: "Mogadishu, Somalia", icon: "map-pin" },
  { label: "Call us", value: "+252-61-4511185", icon: "phone", mono: true },
  { label: "Email us", value: "info@fonexsupply.com", icon: "mail" },
  { label: "Online", value: "www.fonexsupply.com", icon: "globe" },
];
