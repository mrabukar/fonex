import type { Metadata } from "next";
import Image from "next/image";
import { Shield, Lightbulb, Users, Check, Handshake, Leaf } from "lucide-react";
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
        <Container className="relative py-16 pb-[70px]">
          <div
            className="text-[13px] font-bold tracking-[.08em] uppercase mb-4"
            style={{ color: "#8B97C4" }}
          >
            About Fonex Supply Limited
          </div>
          <h1
            className="font-extrabold text-white text-balance max-w-[760px]"
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: "clamp(36px, 4vw, 50px)",
              lineHeight: 1.08,
              letterSpacing: "-.03em",
            }}
          >
            A trusted partner in East Africa&apos;s mobile technology ecosystem
          </h1>
          <p
            className="text-[18px] leading-[1.65] max-w-[640px] mt-6"
            style={{ color: "#A9B2CC" }}
          >
            Established in 2025 in Mogadishu, Somalia, Fonex Supply Limited was
            founded to meet the growing demand for reliable mobile technology
            and digital adaptation across the region.
          </p>
        </Container>
      </section>

      {/* ===== OVERVIEW ===== */}
      <Container as="section" className="py-[74px]">
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
              {
                value: "2025",
                label: "Year established",
                dark: false,
                accent: "#2F5BFF",
              },
              {
                value: "6+",
                label: "Cities reached in year one",
                dark: true,
                accent: "#fff",
              },
              {
                value: "100%",
                label: "Authentic, sourced direct",
                dark: true,
                accent: "#16C2D5",
              },
              {
                value: "4",
                label: "Partnership pillars",
                dark: false,
                accent: "#6C5CE7",
              },
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

      {/* ===== MISSION & VISION ===== */}
      <section
        style={{
          background: "#fff",
          borderTop: "1px solid #E7EAF3",
          borderBottom: "1px solid #E7EAF3",
        }}
      >
        <Container className="py-[74px] grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mission */}
          <FadeIn direction="left">
            <div
              className="relative overflow-hidden rounded-[22px] p-10"
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
          <FadeIn direction="right">
            <div
              className="relative overflow-hidden rounded-[22px] p-10"
              style={{ background: "linear-gradient(135deg,#0B1226,#1C2A55)" }}
            >
              <div className="absolute" style={{ top: -30, right: -30, width: 180, height: 180, border: "1.5px solid rgba(255,255,255,.1)", borderRadius: "50%", pointerEvents: "none" }} />
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
        <FadeIn className="text-center max-w-[640px] mx-auto mb-12">
          <div className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5" style={{ color: "#2F5BFF" }}>
            What we stand for
          </div>
          <h2 className="font-extrabold" style={{ fontFamily: "var(--font-sora)", fontSize: 40, lineHeight: 1.1, letterSpacing: "-.025em", color: "#0B1226" }}>
            Core values that guide every decision
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreValues.map((v) => (
            <StaggerItem
              key={v.title}
              hover
              className="rounded-[18px] p-7"
              style={{ background: "#fff", border: "1px solid #E7EAF3", boxShadow: "0 6px 18px rgba(11,18,38,.04)" }}
            >
              <div className="flex items-center gap-3.5 mb-3.5">
                <div
                  className="inline-flex items-center justify-center rounded-[13px]"
                  style={{ width: 46, height: 46, background: v.tint, color: v.accent, flexShrink: 0 }}
                >
                  {iconMap[v.icon]}
                </div>
                <div className="font-bold text-[19px]" style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}>
                  {v.title}
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
        <Container className="relative py-[74px]">
          <FadeIn>
            <div className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5" style={{ color: "#8B97C4" }}>
              Achievements & milestones
            </div>
            <h2 className="font-extrabold text-white max-w-[600px] mb-12" style={{ fontFamily: "var(--font-sora)", fontSize: 36, lineHeight: 1.12, letterSpacing: "-.025em" }}>
              A strong first chapter, and a clear path ahead
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m) => (
              <StaggerItem key={m.tag} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#2F5BFF", boxShadow: "0 0 0 5px rgba(47,91,255,.2)", display: "block", flexShrink: 0 }} />
                  <span style={{ flex: 1, height: 2, background: "rgba(255,255,255,.12)", display: "block" }} />
                </div>
                <div className="text-[13px] font-semibold mb-2" style={{ fontFamily: "var(--font-jetbrains)", color: "#16C2D5" }}>
                  {m.tag}
                </div>
                <div className="text-[15.5px] leading-[1.55] font-medium" style={{ color: "#C3CADD" }}>
                  {m.text}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>
    </div>
  );
}
