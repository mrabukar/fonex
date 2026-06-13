import type { Metadata } from "next";
import { ShieldCheck, MapPin, Tag, Anchor, Check } from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { reasons, diffPoints, faqs } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

export const metadata: Metadata = {
  title: "Why Fonex",
  description:
    "Discover why Fonex Supply Limited is East Africa's reliable choice for authentic mobile technology supply.",
};

const iconMap: Record<string, React.ReactNode> = {
  "shield-check": <ShieldCheck size={24} strokeWidth={2} />,
  "map-pin": <MapPin size={24} strokeWidth={2} />,
  tag: <Tag size={24} strokeWidth={2} />,
  "life-buoy": <Anchor size={24} strokeWidth={2} />,
};

export default function WhyFonexPage() {
  return (
    <div>
      {/* ===== HEADER ===== */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E7EAF3" }}>
        <Container className="pt-14 pb-11 text-center">
          <FadeIn>
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#2F5BFF" }}
            >
              Why Fonex
            </div>
            <h1
              className="font-extrabold text-balance max-w-190 mx-auto"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: "clamp(36px, 4vw, 50px)",
                lineHeight: 1.08,
                letterSpacing: "-.03em",
                color: "#0B1226",
              }}
            >
              The reliable choice for mobile technology in East Africa
            </h1>
            <p
              className="text-[18px] leading-[1.6] max-w-150 mx-auto mt-5"
              style={{ color: "#4C566F" }}
            >
              We combine authentic products, regional reach, and dependable service into a supply
              partner you can count on.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ===== REASON CARDS ===== */}
      <Container as="section" className="pt-[70px] pb-5">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r) => (
            <StaggerItem
              key={r.title}
              hover
              className="rounded-[20px] p-8"
              style={{
                background: "#fff",
                border: "1px solid #E7EAF3",
                boxShadow: "0 6px 18px rgba(11,18,38,.04)",
              }}
            >
              <div
                className="inline-flex items-center justify-center rounded-[15px]"
                style={{
                  width: 54,
                  height: 54,
                  background: r.tint,
                  color: r.accent,
                }}
              >
                {iconMap[r.icon]}
              </div>
              <div
                className="font-bold text-[20px] mt-5 mb-2.5"
                style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
              >
                {r.title}
              </div>
              <div className="text-[14.5px] leading-[1.6]" style={{ color: "#5A6480" }}>
                {r.body}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>

      {/* ===== DIFFERENCE SPLIT ===== */}
      <Container as="section" className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#2F5BFF" }}
            >
              The Fonex difference
            </div>
            <h2
              className="font-extrabold text-balance mb-5"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 36,
                lineHeight: 1.14,
                letterSpacing: "-.025em",
                color: "#0B1226",
              }}
            >
              Not just a seller — a long-term technology partner
            </h2>
            <p className="text-[16.5px] leading-[1.7] mb-6" style={{ color: "#4C566F" }}>
              Anyone can sell a phone. We focus on the things that build lasting trust: authenticity,
              fair pricing, dependable supply, and support that doesn&apos;t end at checkout.
            </p>
            <StaggerContainer className="flex flex-col gap-3.5">
              {diffPoints.map((d) => (
                <StaggerItem key={d} className="flex items-center gap-3.5">
                  <span
                    className="inline-flex items-center justify-center rounded-[7px] shrink-0"
                    style={{ width: 24, height: 24, background: "#2F5BFF", color: "#fff" }}
                  >
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span className="text-[16px] font-semibold" style={{ color: "#27314B" }}>
                    {d}
                  </span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>

          {/* Stat panel */}
          <FadeIn direction="right">
            <div
              className="relative rounded-[24px] overflow-hidden"
              style={{ height: 380, background: "linear-gradient(150deg,#0B1226,#1C2A55)" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(50% 50% at 70% 25%, rgba(47,91,255,.5), transparent 60%), radial-gradient(45% 45% at 25% 85%, rgba(22,194,213,.4), transparent 60%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px)",
                  backgroundSize: "26px 26px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-[78%]">
                  {[
                    { value: "100%", label: "Authentic stock", color: "#fff" },
                    { value: "24/7", label: "Support", color: "#16C2D5" },
                    { value: "6+", label: "Cities served", color: "#FFB020" },
                    { value: "2025", label: "Trusted since", color: "#fff" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-[16px] p-4"
                      style={{
                        background: "rgba(255,255,255,.08)",
                        border: "1px solid rgba(255,255,255,.12)",
                      }}
                    >
                      <div
                        className="font-extrabold text-[30px]"
                        style={{ fontFamily: "var(--font-sora)", color: s.color }}
                      >
                        {s.value}
                      </div>
                      <div className="text-[13px] mt-0.5" style={{ color: "#A9B2CC" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* ===== FAQ ===== */}
      <section style={{ background: "#fff", borderTop: "1px solid #E7EAF3" }}>
        <div className="max-w-210 mx-auto px-7 py-18.5">
          <FadeIn className="text-center mb-10">
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#2F5BFF" }}
            >
              Questions, answered
            </div>
            <h2
              className="font-extrabold"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 38,
                letterSpacing: "-.025em",
                color: "#0B1226",
              }}
            >
              Frequently asked questions
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <FaqAccordion items={faqs} />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
