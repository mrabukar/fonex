import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, Lightbulb, Users, Check, Handshake, Leaf, MapPin, ArrowRight } from "lucide-react";
import { coreValues, milestones } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Fonex Supply Limited — established in 2025 in Mogadishu, Somalia, serving East Africa with authentic mobile technology.",
};

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield size={22} strokeWidth={2} />,
  lightbulb: <Lightbulb size={22} strokeWidth={2} />,
  users: <Users size={22} strokeWidth={2} />,
  check: <Check size={22} strokeWidth={2} />,
  handshake: <Handshake size={22} strokeWidth={2} />,
  leaf: <Leaf size={22} strokeWidth={2} />,
};

export default function AboutPage() {
  return (
    <div>
      {/* ===== HEADER ===== */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0B1226" }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "54%",
            height: "100%",
            opacity: 0.7,
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 58%)",
            maskImage: "linear-gradient(90deg, transparent, #000 58%)",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1100&q=80"
            alt=""
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 80% at 78% 25%, rgba(47,91,255,.55), transparent 62%), radial-gradient(45% 70% at 12% 90%, rgba(108,92,231,.45), transparent 62%), linear-gradient(90deg, #0B1226 38%, rgba(11,18,38,.35))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <Container className="relative py-20 pb-24">
          {/* Location badge */}
          <FadeIn delay={0}>
            <div
              className="inline-flex items-center gap-2 rounded-full mb-7 px-4 py-2"
              style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.13)" }}
            >
              <MapPin size={13} style={{ color: "#16C2D5" }} />
              <span className="text-[13px] font-semibold" style={{ color: "#A9B2CC" }}>
                Mogadishu, Somalia · Est. 2025
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1
              className="font-extrabold text-white text-balance max-w-190 mb-6"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: "clamp(40px, 5vw, 58px)",
                lineHeight: 1.06,
                letterSpacing: "-.03em",
              }}
            >
              A trusted partner in East Africa&apos;s mobile technology ecosystem
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p
              className="text-[18px] leading-[1.65] max-w-150 mb-12"
              style={{ color: "#A9B2CC" }}
            >
              Founded to meet the growing demand for reliable mobile technology
              and digital adaptation across the region.
            </p>
          </FadeIn>

          {/* Stat pills */}
          <StaggerContainer className="flex flex-wrap gap-3">
            {[
              { value: "6+", label: "Cities reached" },
              { value: "100%", label: "Authentic products" },
              { value: "Est. 2025", label: "Year founded" },
              { value: "East Africa", label: "Region served" },
            ].map((s) => (
              <StaggerItem
                key={s.label}
                className="rounded-full px-5 py-2.5 flex items-center gap-2.5"
                style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.11)" }}
              >
                <span
                  className="font-bold text-[15px]"
                  style={{ fontFamily: "var(--font-sora)", color: "#fff" }}
                >
                  {s.value}
                </span>
                <span className="text-[13px]" style={{ color: "#7B8EB5" }}>{s.label}</span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ===== OVERVIEW ===== */}
      <Container as="section" className="py-18.5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <FadeIn direction="left">
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#2F5BFF" }}
            >
              Company overview
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
              Specialists in authentic mobile technology
            </h2>
            <p className="text-[16.5px] leading-[1.7] mb-4" style={{ color: "#4C566F" }}>
              Fonex Supply Limited is a premier supplier of smartphones, mobile devices, and
              accessories. We specialize in importing, distributing, and delivering authentic
              products from global brands.
            </p>
            <p className="text-[16.5px] leading-[1.7]" style={{ color: "#4C566F" }}>
              From our base in Somalia, we&apos;ve positioned ourselves as a dependable link
              between the world&apos;s leading manufacturers and the retailers, businesses, and
              people of East Africa.
            </p>
          </FadeIn>

          {/* Stat grid */}
          <StaggerContainer className="grid grid-cols-2 gap-4">
            {[
              { value: "2025", label: "Year established", dark: false, accent: "#2F5BFF" },
              { value: "6+", label: "Cities reached in year one", dark: true, accent: "#fff" },
              { value: "100%", label: "Authentic, sourced direct", dark: true, accent: "#16C2D5" },
              { value: "4", label: "Partnership pillars", dark: false, accent: "#6C5CE7" },
            ].map((stat) => (
              <StaggerItem
                key={stat.label}
                className="rounded-[18px] p-6"
                style={{
                  background: stat.dark ? "#0B1226" : "#fff",
                  border: stat.dark ? "none" : "1px solid #E7EAF3",
                  boxShadow: stat.dark ? "none" : "0 6px 18px rgba(11,18,38,.04)",
                }}
              >
                <div
                  className="font-extrabold text-[34px]"
                  style={{ fontFamily: "var(--font-sora)", color: stat.accent }}
                >
                  {stat.value}
                </div>
                <div className="text-[14px] mt-1" style={{ color: stat.dark ? "#A9B2CC" : "#5A6480" }}>
                  {stat.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Container>

      {/* ===== STORY ===== */}
      <section style={{ background: "#F6F8FF", borderTop: "1px solid #E7EAF3", borderBottom: "1px solid #E7EAF3" }}>
        <Container className="py-18.5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
            {/* Photo with floating card */}
            <FadeIn direction="left" className="relative h-[420px] hidden lg:block">
              <div className="absolute inset-0 rounded-[24px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                  alt="Fonex team"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(47,91,255,.28), rgba(11,18,38,.55))" }} />
              </div>
              <div
                className="absolute -bottom-5 -right-5 rounded-[18px] p-5"
                style={{ background: "#0B1226", boxShadow: "0 20px 40px rgba(11,18,38,.25)", minWidth: 210 }}
              >
                <div className="text-[13px] font-semibold mb-1" style={{ color: "#8B97C4" }}>Serving since</div>
                <div
                  className="font-extrabold text-[32px] text-white"
                  style={{ fontFamily: "var(--font-sora)", lineHeight: 1.1 }}
                >
                  2025
                </div>
                <div className="text-[13px] mt-1" style={{ color: "#A9B2CC" }}>Mogadishu, Somalia</div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5" style={{ color: "#2F5BFF" }}>
                Our story
              </div>
              <h2
                className="font-extrabold text-balance mb-6"
                style={{ fontFamily: "var(--font-sora)", fontSize: 34, lineHeight: 1.14, letterSpacing: "-.025em", color: "#0B1226" }}
              >
                Born from a need. Built for a region.
              </h2>
              <p className="text-[16.5px] leading-[1.75] mb-5" style={{ color: "#4C566F" }}>
                East Africa is one of the fastest-growing mobile markets in the world — yet reliable
                access to authentic devices has always been a challenge. Fonex Supply Limited was
                created to close that gap.
              </p>
              <p className="text-[16.5px] leading-[1.75] mb-8" style={{ color: "#4C566F" }}>
                Starting in Mogadishu, we built a supply chain from the ground up: trusted
                manufacturer relationships, a growing distribution network, and a firm commitment
                to delivering genuine products — every device authentic, every partner vetted,
                every customer a long-term relationship.
              </p>
              <blockquote
                className="rounded-[16px] p-6"
                style={{ background: "linear-gradient(135deg,#EEF1FB,#F6F8FF)", borderLeft: "4px solid #2F5BFF" }}
              >
                <p className="font-semibold text-[15.5px] leading-[1.6]" style={{ color: "#0B1226", fontStyle: "italic" }}>
                  &ldquo;We don&apos;t just supply phones — we connect people to opportunity.&rdquo;
                </p>
                <div className="mt-3 text-[13px] font-semibold" style={{ color: "#2F5BFF" }}>
                  — Fonex Supply Limited Team
                </div>
              </blockquote>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E7EAF3" }}>
        <Container className="py-18.5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission */}
          <FadeIn direction="left" className="h-full">
            <div
              className="relative overflow-hidden rounded-[22px] p-10 h-full"
              style={{ background: "linear-gradient(135deg,#EEF1FB,#F6F8FF)", border: "1px solid #E0E6FA" }}
            >
              <div
                className="inline-flex items-center justify-center rounded-[14px] mb-6"
                style={{ width: 50, height: 50, background: "#2F5BFF", color: "#fff", boxShadow: "0 8px 20px rgba(47,91,255,.3)" }}
              >
                <Shield size={22} strokeWidth={2} />
              </div>
              <div className="font-bold text-[14px] tracking-[.06em] uppercase mb-3" style={{ color: "#2F5BFF", fontFamily: "var(--font-sora)" }}>
                Our Mission
              </div>
              <p className="font-bold text-balance" style={{ fontFamily: "var(--font-sora)", fontSize: 23, lineHeight: 1.35, letterSpacing: "-.01em", color: "#0B1226" }}>
                To empower individuals and businesses by supplying innovative smartphones and
                accessories that enhance communication, productivity, and digital inclusion —
                through high-quality mobiles and spare parts.
              </p>
            </div>
          </FadeIn>

          {/* Vision */}
          <FadeIn direction="right" className="h-full">
            <div
              className="relative overflow-hidden rounded-[22px] p-10 h-full"
              style={{ background: "linear-gradient(135deg,#0B1226,#1C2A55)" }}
            >
              <div className="absolute" style={{ top: -30, right: -30, width: 180, height: 180, border: "1.5px solid rgba(255,255,255,.08)", borderRadius: "50%", pointerEvents: "none" }} />
              <div className="absolute" style={{ top: -80, right: -80, width: 300, height: 300, border: "1px solid rgba(255,255,255,.04)", borderRadius: "50%", pointerEvents: "none" }} />
              <div
                className="inline-flex items-center justify-center rounded-[14px] mb-6"
                style={{ width: 50, height: 50, background: "#FFB020", color: "#fff", boxShadow: "0 8px 20px rgba(255,176,32,.3)" }}
              >
                <Lightbulb size={22} strokeWidth={2} />
              </div>
              <div className="font-bold text-[14px] tracking-[.06em] uppercase mb-3" style={{ color: "#FFB020", fontFamily: "var(--font-sora)" }}>
                Our Vision
              </div>
              <p className="relative font-bold text-balance" style={{ fontFamily: "var(--font-sora)", fontSize: 23, lineHeight: 1.35, letterSpacing: "-.01em", color: "#fff" }}>
                To become East Africa&apos;s most trusted mobile supply company — recognized for
                reliability, affordability, and excellence in customer service.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ===== CORE VALUES ===== */}
      <Container as="section" className="py-20">
        <FadeIn className="text-center max-w-160 mx-auto mb-12">
          <div className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5" style={{ color: "#2F5BFF" }}>
            What we stand for
          </div>
          <h2 className="font-extrabold" style={{ fontFamily: "var(--font-sora)", fontSize: 40, lineHeight: 1.1, letterSpacing: "-.025em", color: "#0B1226" }}>
            Core values that guide every decision
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreValues.map((v, i) => (
            <StaggerItem
              key={v.title}
              hover
              className="rounded-[18px] p-7"
              style={{ background: "#fff", border: "1px solid #E7EAF3", boxShadow: "0 6px 18px rgba(11,18,38,.04)" }}
            >
              <div className="flex items-start gap-3.5 mb-3.5">
                <div
                  className="inline-flex items-center justify-center rounded-[13px] flex-shrink-0"
                  style={{ width: 46, height: 46, background: v.tint, color: v.accent }}
                >
                  {iconMap[v.icon]}
                </div>
                <div>
                  <div
                    className="text-[11px] font-bold tabular-nums mb-0.5"
                    style={{ color: "#B0B9D0", fontFamily: "var(--font-jetbrains)" }}
                  >
                    0{i + 1}
                  </div>
                  <div className="font-bold text-[19px]" style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}>
                    {v.title}
                  </div>
                </div>
              </div>
              <div className="text-[14.5px] leading-[1.6]" style={{ color: "#5A6480" }}>
                {v.body}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>

      {/* ===== MILESTONES ===== */}
      <section className="relative overflow-hidden" style={{ background: "#0B1226" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(40% 60% at 85% 30%, rgba(47,91,255,.25), transparent 60%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <Container className="relative py-[80px]">
          <FadeIn>
            <div className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5" style={{ color: "#8B97C4" }}>
              Achievements & milestones
            </div>
            <h2 className="font-extrabold text-white max-w-150 mb-16" style={{ fontFamily: "var(--font-sora)", fontSize: 36, lineHeight: 1.12, letterSpacing: "-.025em" }}>
              A strong first chapter, and a clear path ahead
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {milestones.map((m, i) => (
              <StaggerItem key={m.tag} className="relative pr-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 font-bold"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(47,91,255,.18)",
                      border: "1.5px solid rgba(47,91,255,.5)",
                      color: "#6B8FFF",
                      fontSize: 13,
                      fontFamily: "var(--font-jetbrains)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i < milestones.length - 1 && (
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(47,91,255,.4), rgba(255,255,255,.06))" }} />
                  )}
                </div>
                <div className="text-[12px] font-bold tracking-[.08em] mb-2" style={{ fontFamily: "var(--font-jetbrains)", color: "#16C2D5" }}>
                  {m.tag}
                </div>
                <div className="text-[15.5px] leading-[1.6] font-medium" style={{ color: "#C3CADD" }}>
                  {m.text}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ background: "#fff", borderTop: "1px solid #E7EAF3" }}>
        <Container className="py-20">
          <FadeIn className="max-w-[700px] mx-auto text-center">
            <div className="text-[13px] font-bold tracking-[.08em] uppercase mb-4" style={{ color: "#2F5BFF" }}>
              Partner with us
            </div>
            <h2
              className="font-extrabold mb-5"
              style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-.03em", color: "#0B1226" }}
            >
              Ready to grow with Fonex?
            </h2>
            <p className="text-[17px] leading-[1.7] mb-8 max-w-[520px] mx-auto" style={{ color: "#5A6480" }}>
              Whether you&apos;re a retailer, distributor, or business looking for a reliable mobile
              technology supplier — we&apos;d love to work with you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-[15px] text-white transition-opacity hover:opacity-90"
                style={{ background: "#2F5BFF", fontFamily: "var(--font-sora)", boxShadow: "0 8px 24px rgba(47,91,255,.3)" }}
              >
                Get in touch <ArrowRight size={16} />
              </Link>
              <Link
                href="/partnerships"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-[15px] transition-colors hover:bg-[#E8EBF5]"
                style={{ background: "#F0F2FA", color: "#0B1226", fontFamily: "var(--font-sora)" }}
              >
                View partnerships
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
