# Build Prompt — Fonex Supply Limited Website (Next.js + shadcn/ui + Tailwind)

> Copy everything below the line into Claude Code. It is written to reproduce the approved design
> (or improve on it) with a production-grade stack.

---

## Role & goal

You are a senior frontend engineer + product designer. Build a **modern, premium, trustworthy
marketing website** for **Fonex Supply Limited**, a mobile-technology supplier in East Africa.
Reproduce the approved design direction described below faithfully — and where you can make it
**cleaner, more accessible, or more performant without changing the visual identity, do so**.

Quality bar: this should look like a real, paid agency build — not a template. Sweat the
typography, spacing rhythm, colour, and the mix of real product photography + hand-drawn graphics.
No emoji, no AI-flavored iconography (no sparkles/wand/bot/magic). Lean colourful and vibrant —
the client explicitly asked for a bright, premium, beautiful site.

## Tech stack (use exactly this)

- **Next.js 16+** (App Router, TypeScript, Server Components by default; `"use client"` only where
  interaction is needed)
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **shadcn/ui** for primitives (Button, Card, Input, Textarea, Select, Accordion, Badge, Sheet for
  the mobile nav)
- **lucide-react** for icons (2px outline, no fills)
- **next/font** to load Google fonts (Sora, Manrope, JetBrains Mono)
- No CMS — content lives in typed `lib/content.ts` data files so it's easy to edit later
- Fully responsive (mobile-first), accessible (semantic landmarks, focus-visible rings, reduced-
  motion support), and SEO-ready (per-page `metadata`, Open Graph)

## Brand & design system

Define these as Tailwind theme tokens (`@theme` in `app/globals.css`) and use them everywhere.

**Colors**
- `--ink: #0B1226` (near-black navy — primary text, dark sections)
- `--ink-2: #1C2A55` (gradient partner to ink)
- `--brand: #2F5BFF` (Fonex Blue — primary actions, links, accents)
- `--brand-deep: #2147E6` (hover/pressed)
- `--cyan: #16C2D5` (secondary / "stock" accent)
- `--violet: #6C5CE7` (reports/gradient blends)
- `--amber: #FFB020` (warm spark, used sparingly)
- `--mist: #F4F6FB` (page background)
- `--paper: #FFFFFF` (cards)
- `--line: #E7EAF3` (hairline borders)
- `--muted: #5A6480` (body-secondary text)
- Status: emerald `#067A55` / amber `#9A6400` / violet `#5A3FC0` for In Stock / Limited / Pre-Order pills

**Typography**
- Display/headings: **Sora** (700–800), tight tracking (`-0.02em` to `-0.03em`)
- Body/UI: **Manrope** (400–700), line-height ~1.6
- Numeric/spec/mono: **JetBrains Mono** (phone numbers, SKUs, "Price on request")
- Hero H1 ~56–66px desktop, section H2 ~36–40px, body 16–18px. Use `text-wrap: balance` on headings.

**Shape & depth**
- Radii: inputs 11px, cards 18–22px, pills/badges full. Buttons 12–13px.
- Borders: 1px hairline `--line` do the structural work.
- Shadows: soft and low — cards `0 6px 18px rgba(11,18,38,.04)`; CTAs get a colored shadow
  `0 12px 28px rgba(47,91,255,.28)`. No hover-lift; hover = color shift only.
- The one signature gradient: `linear-gradient(120deg, #2F5BFF, #6C5CE7)` — reserve it for primary
  CTA bands and key accents. Dark sections use radial mesh glows of brand/cyan/violet over `--ink`.

**Motion** — minimal and purposeful: a single staggered fade-up on hero load, 200ms color
transitions, accordion height, gentle float on the hero device graphic. Respect
`prefers-reduced-motion`. No scroll-jacking, no number count-ups, no card scale.

## Imagery (use REAL photos via Unsplash + colourful brand overlays)

The client wants real photography, not abstract placeholders. Use Unsplash CDN URLs
(`https://images.unsplash.com/photo-<id>?w=<width>&q=80`) — they're free, hotlinkable, and stable.
Wrap each photo in a **colourful brand-gradient overlay** so the imagery stays on-palette:
- Product cards: real device/accessory photo + a per-category colour wash
  `linear-gradient(160deg, rgba(accent,.34), rgba(accent2,.06) 55%, transparent)`.
- Dark page headers (About, Partnerships): a real photo faded in from the right with
  `mask-image: linear-gradient(90deg, transparent, #000 58%)`, over the navy + radial mesh.
- Home mission band: a warm community/people photo under a blue→violet gradient (digital-inclusion message).
The approved build uses these exact image IDs (swap for the client's real product shots later):
phones `1511707171634-5f897ff02aa9`, `1592750475338-74b7b21085ab`, `1598327105666-5b89351aff97`,
`1574944985070-8f3ebc6b79d2`, `1565849904461-04a58ad377e0`, `1610945265064-0e34e5519bbf`;
charger `1583863788434-e58a36330cf0`; earbuds `1590658268037-6bf12165a8df`; case `1601784551446-20c9e07cdbdb`;
watch `1579586337278-3befd40fd17a`; repair `1580910051074-3eb694886505`; battery `1609091839311-d5365f9ff1c5`;
About header `1512941937669-90a1b58e7e9c`; Partnerships header `1521737604893-d14cc237f11d`;
mission/community `1488521787991-ed7bbaae773c`. Use `next/image` with `remotePatterns` for `images.unsplash.com`.
Keep the CSS phone/device graphics too — they pair well with the photos as floating accents.

## Signature graphics (build with CSS/SVG, alongside the photos)

These are what make it memorable; reproduce them as reusable components:
- **`<PhoneGraphic />`** — a CSS phone: rounded-38px dark bezel, gradient "screen" with floating app
  tiles, a notch pill. Add a subtle infinite float animation.
- **Gradient mesh** — layered `radial-gradient` glows (brand/cyan/violet at low alpha) behind dark
  sections; optionally blurred.
- **Signal arcs** — concentric circular borders (low-alpha brand) radiating behind the phone, a soft
  pulse animation.
- **Dotted grid** — `radial-gradient(circle, rgba(...) 1px, transparent 1px)` background, masked.
- **Floating chips** — small white cards ("In stock", "Genuine guaranteed") overlapping the phone.
- **Product image frames** — for the catalog, each product is a REAL Unsplash photo in a fixed-height
  frame (object-cover) with the per-category colour-wash overlay on top, plus category + status pills.
  (The CSS device tiles can stay as an optional fallback / loading state.)

## Global layout

- **Sticky top navbar** (72px): Fonex logo (a small mark = 3 ascending bars in a blue→violet rounded
  square + "Fonex" wordmark in Sora 800) · nav links (Home, About, Products, Partnerships, Why Fonex,
  Contact) · primary **"Browse Products"** button. Translucent white + backdrop-blur, hairline bottom
  border. Collapse to a shadcn **Sheet** drawer on mobile.
- **Footer** (dark `--ink`): brand blurb, Explore links, Products list, and contact block
  (Mogadishu, Somalia · +252-61-4511185 · info@fonexsupply.com · www.fonexsupply.com) + copyright.
- Content max-width ~1200px, 28px gutters.

> NOTE: the approved prototype had a top "designer bar" toggle between Website and a Project Plan view —
> that was a presentation device. **Do not build it.** Ship just the website.

## Pages, sections & copy

Use this copy verbatim as the starting point (it's approved); keep the voice plain, calm, business-grade.

### 1. Home (`/`)
- **Hero** — eyebrow `EST. 2025 · MOGADISHU, SOMALIA`; H1 **"Authentic mobile technology, delivered
  across East Africa."** (gradient-clip the second clause); sub: "Fonex Supply Limited imports and
  distributes genuine smartphones, accessories, and spare parts — connecting people, businesses, and
  communities to the devices that move them forward."; buttons **Browse Products** (primary) +
  **Become a Partner** (ghost); a 3-stat row (100% Authentic stock · 6+ Cities served · 24/7
  After-sales support); right side = `PhoneGraphic` + signal arcs + floating chips.
  *(Optional nicety: support 3 hero layout variants behind a config flag — editorial split / centered /
  dark premium — but default to the editorial split.)*
- **Trust / brand strip** — "Authentic stock from leading global brands" + the category words.
- **Services preview** — H2 "Everything mobile, from one trusted source" + 6 cards (Flagship
  Smartphones, Mid-Range Devices, Essential Accessories, Smart Wearables, Spare Parts, After-Sales
  Support), each with a lucide icon in a tinted circle. Link to /products.
- **Mission split** — dark gradient panel ("Digital inclusion, by design") + copy: H2 "Empowering
  people and businesses through reliable mobile technology" with a 2×2 checklist (Authentic warrantied
  products · Reliable regional distribution · Competitive partner pricing · Dependable after-sales
  support).
- **CTA band** (signature gradient) — "Ready to stock authentic devices your customers can trust?" +
  Request a Quote / Become a Partner.

### 2. About (`/about`)
- Dark mesh **header** — H1 "A trusted partner in East Africa's mobile technology ecosystem" + intro
  (founded 2025 in Mogadishu to meet growing demand for reliable mobile tech and digital adaptation).
- **Company overview** split + a 2×2 stat grid (2025 founded · 6+ cities · 100% authentic · 4
  partnership pillars).
- **Mission & Vision** — paired cards (light blue + dark). Mission: "To empower individuals and
  businesses by supplying innovative smartphones and accessories that enhance communication,
  productivity, and digital inclusion — through high-quality mobiles and spare parts." Vision: "To
  become East Africa's most trusted mobile supply company — recognized for reliability, affordability,
  and excellence in customer service."
- **Core values** — 6 cards with icons: Integrity, Innovation, Customer Focus, Reliability,
  Partnership, Sustainability (use the descriptions from the company profile).
- **Milestones** (dark) — 4-step timeline: Launch (2025, one of Somalia's first dedicated mobile
  supply companies) · Year One (expanded distribution across major Somali cities) · Partnerships
  (secured international manufacturer partnerships) · Community (launched customer education / digital-
  inclusion programs).

### 3. Products & Services (`/products`)
- **Header** — H1 "Browse our range of authentic mobile technology" + intro.
- **Category filter** — pill buttons: All Products / Flagship / Mid-Range / Accessories / Wearables /
  Spare Parts (client-side filter; this section is `"use client"`).
- **Product grid** — ~12 cards: category chip, status pill, CSS device graphic, name, short blurb,
  "Price on request" (mono) + **Enquire** button linking to /contact. Seed data (placeholder names to
  be swapped for real models): Aurora Pro 5G, Aurora Ultra, Zenith 5G (flagship); Everyday 4G, Connect
  Lite, Vibe Plus (mid-range); Power Charger 33W, Wireless Earbuds, Protective Case (accessories);
  Active Smartwatch (wearable); Display Module, Battery Pack (spare parts).
- **Services band** (dark) — Import & Distribution · Wholesale Supply · After-Sales Support.

### 4. Partnerships (`/partnerships`)
- Dark **header** — H1 "Built on strong, trusted relationships".
- **4 pillar cards** (accent top-bar + icon): Global Manufacturers, Local Retailers, Technology
  Providers, Community Organizations — descriptions from the profile.
- **Why partner** — 6-item benefit checklist (Authentic Products, Competitive Pricing, Reliable
  Delivery, After-Sales Support, Transparent Dealing, Long-Term Focus).
- **CTA** (signature gradient) — "Let's grow together" → Start a Conversation (/contact).

### 5. Why Fonex (`/why-fonex`)
- **Header** (centered) — H1 "The reliable choice for mobile technology in East Africa".
- **4 reason cards** — Authentic Guaranteed, Regional Reach, Fair Pricing, Support That Lasts.
- **The Fonex difference** split — H2 "Not just a seller — a long-term technology partner" + 4-point
  checklist; right side = dark stat panel (100% / 24/7 / 6+ / 2025).
- **FAQ** — shadcn **Accordion**, 5 Q&As (genuine products? sell to retailers & businesses? areas
  served? after-sales & spare parts? how to request a quote?). First item open by default.

### 6. Contact (`/contact`)
- **Header** — H1 "Let's talk about what you need".
- Two-column: **dark info card** (Visit: Mogadishu, Somalia · Call: +252-61-4511185 · Email:
  info@fonexsupply.com · Online: www.fonexsupply.com · business hours Sat–Thu 8:00–18:00, Fri closed)
  + **enquiry form** (name, phone, email, "I'm interested in" select [Buying products / Becoming a
  retail partner / Wholesale bulk supply / Spare parts & support / Something else], message). Validate
  with react-hook-form + zod; show an inline **success state** on submit ("Message sent" + check). Wire
  the submit to a Next.js server action / route handler stub that's easy to connect to email later.

## Suggested file structure
```
app/
  layout.tsx            // fonts, <Navbar/>, <Footer/>, metadata
  page.tsx              // Home
  about/page.tsx
  products/page.tsx     // grid is a client component inside
  partnerships/page.tsx
  why-fonex/page.tsx
  contact/page.tsx
  globals.css           // @theme tokens
components/
  ui/                   // shadcn
  navbar.tsx  footer.tsx  section-heading.tsx  cta-band.tsx
  graphics/  phone-graphic.tsx  gradient-mesh.tsx  device-tile.tsx
  home/  about/  products/  ...
lib/
  content.ts            // typed page copy + products + values + faqs + partners
```

## Acceptance checklist
- [ ] All 6 pages built with the copy above, responsive down to 360px
- [ ] Brand tokens centralized; no hard-coded hex outside the theme
- [ ] Sora/Manrope/JetBrains Mono via next/font, no layout shift
- [ ] Hand-drawn phone & device graphics (no images), gradient meshes, signal arcs
- [ ] Working product category filter, FAQ accordion, contact form with validation + success state
- [ ] Accessible: landmarks, alt/aria, visible focus rings, `prefers-reduced-motion` respected
- [ ] Per-page metadata + OG; Lighthouse ≥95 across the board
- [ ] No emoji, no AI-flavored icons; real Unsplash photography with colourful brand overlays

Begin by scaffolding the Next.js app, wiring the theme tokens and fonts, building the Navbar/Footer
and the graphics primitives, then implement pages in the order above. Ask me before introducing any
content not listed here.
