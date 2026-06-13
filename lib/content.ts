export const siteConfig = {
  name: "Fonex Supply Limited",
  tagline: "Premier mobile technology supplier in East Africa",
  address: "Mogadishu, Somalia",
  phone: "+252-61-4511185",
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
  { label: "Why Fonex", href: "/why-fonex" },
  { label: "Contact", href: "/contact" },
];

export const services = [
  {
    title: "Flagship Smartphones",
    body: "The latest premium devices from leading global brands — authentic, sealed, and warranty-backed.",
    accent: "#2F5BFF",
    tint: "#EEF1FB",
    icon: "phone",
  },
  {
    title: "Mid-Range Devices",
    body: "Dependable, affordable smartphones that bring connectivity within reach for everyone.",
    accent: "#16C2D5",
    tint: "#E6F8FA",
    icon: "layers",
  },
  {
    title: "Essential Accessories",
    body: "Chargers, earphones, protective cases and more — the everyday essentials that keep devices running.",
    accent: "#6C5CE7",
    tint: "#EFEDFC",
    icon: "headphones",
  },
  {
    title: "Smart Wearables",
    body: "Smartwatches and connected devices for the modern, mobile-first digital lifestyle.",
    accent: "#FFB020",
    tint: "#FFF4E0",
    icon: "watch",
  },
  {
    title: "Spare Parts",
    body: "Genuine replacement components for long-term reliability and easy repairs.",
    accent: "#2F5BFF",
    tint: "#EEF1FB",
    icon: "wrench",
  },
  {
    title: "After-Sales Support",
    body: "Reliable service and guidance after every purchase — trust that lasts beyond the sale.",
    accent: "#16C2D5",
    tint: "#E6F8FA",
    icon: "check-circle",
  },
];

export const coreValues = [
  {
    title: "Integrity",
    body: "Transparent and ethical business practices in every transaction.",
    tint: "#EEF1FB",
    accent: "#2F5BFF",
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
    accent: "#16C2D5",
    icon: "users",
  },
  {
    title: "Reliability",
    body: "Consistent delivery and dependable product quality, every time.",
    tint: "#EFEDFC",
    accent: "#6C5CE7",
    icon: "check",
  },
  {
    title: "Partnership",
    body: "Building strong collaborations with suppliers and clients.",
    tint: "#EEF1FB",
    accent: "#2F5BFF",
    icon: "handshake",
  },
  {
    title: "Sustainability",
    body: "Promoting responsible practices that benefit society and the environment.",
    tint: "#E6F8FA",
    accent: "#16C2D5",
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

export type ProductCategory =
  | "all"
  | "flagship"
  | "midrange"
  | "accessories"
  | "wearables"
  | "parts";
export type ProductStatus = "In Stock" | "Limited" | "Pre-Order";
export type DeviceType =
  | "phone"
  | "watch"
  | "charger"
  | "earbuds"
  | "case"
  | "screen"
  | "battery";

export type ColorFamily = {
  bgA: string;
  bgB: string;
  g1: string;
  g2: string;
};

export const colorFamilies: Record<string, ColorFamily> = {
  blue: { bgA: "#EAF0FF", bgB: "#DCE6FF", g1: "#2F5BFF", g2: "#5B7BFF" },
  violet: { bgA: "#F1EEFC", bgB: "#E6DEFB", g1: "#6C5CE7", g2: "#8A7BF0" },
  cyan: { bgA: "#E4F8FB", bgB: "#D2F2F6", g1: "#16C2D5", g2: "#3AD3E0" },
  teal: { bgA: "#E6F8F2", bgB: "#D4F2E8", g1: "#12B58E", g2: "#2FD0A6" },
  amber: { bgA: "#FFF6E6", bgB: "#FFEDC9", g1: "#FFB020", g2: "#F59300" },
  slate: { bgA: "#EEF1F6", bgB: "#E2E7F0", g1: "#5B6680", g2: "#7B8499" },
};

export const products = [
  {
    name: "Aurora Pro 5G",
    cat: "flagship" as ProductCategory,
    fam: "blue",
    type: "phone" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "6.7″ OLED flagship with pro-grade cameras and all-day battery.",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  },
  {
    name: "Aurora Ultra",
    cat: "flagship" as ProductCategory,
    fam: "violet",
    type: "phone" as DeviceType,
    status: "Limited" as ProductStatus,
    blurb: "Top-tier performance and premium glass build, 5G on every band.",
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
  },
  {
    name: "Zenith 5G",
    cat: "flagship" as ProductCategory,
    fam: "cyan",
    type: "phone" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "Flagship power at a sharper price, built for heavy multitaskers.",
    img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
  },
  {
    name: "Everyday 4G",
    cat: "midrange" as ProductCategory,
    fam: "teal",
    type: "phone" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "A dependable daily smartphone with a big, bright display.",
    img: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80",
  },
  {
    name: "Connect Lite",
    cat: "midrange" as ProductCategory,
    fam: "blue",
    type: "phone" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "Affordable connectivity with reliable performance for daily life.",
    img: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
  },
  {
    name: "Vibe Plus",
    cat: "midrange" as ProductCategory,
    fam: "cyan",
    type: "phone" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "Bigger battery and a smooth experience at an accessible price.",
    img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
  },
  {
    name: "Power Charger 33W",
    cat: "accessories" as ProductCategory,
    fam: "amber",
    type: "charger" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "Fast, safe charging with broad device compatibility.",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
  },
  {
    name: "Wireless Earbuds",
    cat: "accessories" as ProductCategory,
    fam: "violet",
    type: "earbuds" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "Crisp wireless audio with long playback and quick pairing.",
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
  },
  {
    name: "Protective Case",
    cat: "accessories" as ProductCategory,
    fam: "slate",
    type: "case" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "Slim, shock-absorbing protection for everyday durability.",
    img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
  },
  {
    name: "Active Smartwatch",
    cat: "wearables" as ProductCategory,
    fam: "blue",
    type: "watch" as DeviceType,
    status: "Limited" as ProductStatus,
    blurb: "Track your health and stay connected on the move.",
    img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
  },
  {
    name: "Display Module",
    cat: "parts" as ProductCategory,
    fam: "slate",
    type: "screen" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "Genuine replacement screens for fast, reliable repairs.",
    img: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
  },
  {
    name: "Battery Pack",
    cat: "parts" as ProductCategory,
    fam: "teal",
    type: "battery" as DeviceType,
    status: "In Stock" as ProductStatus,
    blurb: "Original-spec batteries for restored, long-lasting performance.",
    img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
  },
];

export const categoryLabels: Record<string, string> = {
  flagship: "Flagship",
  midrange: "Mid-Range",
  accessories: "Accessory",
  wearables: "Wearable",
  parts: "Spare Part",
};

export const categoryFilters = [
  { key: "all", label: "All Products" },
  { key: "flagship", label: "Flagship" },
  { key: "midrange", label: "Mid-Range" },
  { key: "accessories", label: "Accessories" },
  { key: "wearables", label: "Wearables" },
  { key: "parts", label: "Spare Parts" },
];

export const partnerPillars = [
  {
    title: "Global Manufacturers",
    tag: "GLOBAL SOURCING",
    accent: "#2F5BFF",
    tint: "#EEF1FB",
    body: "Ensuring authentic, high-quality smartphones and accessories sourced directly from the world's leading brands.",
    icon: "globe",
  },
  {
    title: "Local Retailers",
    tag: "REGIONAL NETWORK",
    accent: "#16C2D5",
    tint: "#E6F8FA",
    body: "Supporting Somali businesses with reliable stock and competitive pricing to help them serve their customers and grow.",
    icon: "store",
  },
  {
    title: "Technology Providers",
    tag: "LOGISTICS & IT",
    accent: "#6C5CE7",
    tint: "#EFEDFC",
    body: "Partnering with logistics and IT firms to enhance efficiency and reliability across our supply chain.",
    icon: "server",
  },
  {
    title: "Community Organizations",
    tag: "SOCIAL IMPACT",
    accent: "#FFB020",
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
    accent: "#2F5BFF",
    icon: "shield-check",
  },
  {
    title: "Regional Reach",
    body: "Reliable distribution across major Somali cities and beyond.",
    tint: "#E6F8FA",
    accent: "#16C2D5",
    icon: "map-pin",
  },
  {
    title: "Fair Pricing",
    body: "Competitive, transparent rates for customers and partners alike.",
    tint: "#EFEDFC",
    accent: "#6C5CE7",
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
