import type { Metadata } from "next";
import { Globe, Store, Server, Heart, Check } from "lucide-react";
import { partnerPillars, partnerBenefits } from "@/lib/content";
import { CtaBand } from "@/components/cta-band";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Build a lasting partnership with Fonex Supply Limited. We serve global manufacturers, local retailers, technology providers, and community organizations.",
};

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={24} strokeWidth={2} />,
  store: <Store size={24} strokeWidth={2} />,
  server: <Server size={24} strokeWidth={2} />,
  heart: <Heart size={24} strokeWidth={2} />,
};

export default function PartnershipsPage() {
  return (
    <div>
      {/* ===== HEADER ===== */}
      <section className="relative overflow-hidden" style={{ background: "#0B1226" }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 70% at 82% 25%, rgba(22,194,213,.3), transparent 60%), radial-gradient(40% 60% at 12% 85%, rgba(47,91,255,.32), transparent 60%)",
          }}
        />
        <Container className="relative py-16 pb-[70px]">
          <div
            className="text-[13px] font-bold tracking-[.08em] uppercase mb-4"
            style={{ color: "#8B97C4" }}
          >
            Clientele & Partnerships
          </div>
          <h1
            className="font-extrabold text-white text-balance max-w-[740px]"
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: "clamp(36px, 4vw, 50px)",
              lineHeight: 1.08,
              letterSpacing: "-.03em",
            }}
          >
            Built on strong, trusted relationships
          </h1>
          <p className="text-[18px] leading-[1.65] max-w-[620px] mt-6" style={{ color: "#A9B2CC" }}>
            Our network connects global manufacturers, local retailers, technology providers, and
            community organizations — together building East Africa&apos;s mobile future.
          </p>
        </Container>
      </section>

      {/* ===== PILLARS ===== */}
      <Container as="section" className="py-[74px] pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {partnerPillars.map((p) => (
            <div
              key={p.title}
              className="relative overflow-hidden rounded-[22px] p-8"
              style={{
                background: "#fff",
                border: "1px solid #E7EAF3",
                boxShadow: "0 6px 18px rgba(11,18,38,.04)",
              }}
            >
              {/* Accent top bar */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{ height: 5, background: p.accent }}
              />
              <div className="flex items-center gap-4 mb-4 mt-2">
                <div
                  className="inline-flex items-center justify-center rounded-[15px] flex-shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    background: p.tint,
                    color: p.accent,
                  }}
                >
                  {iconMap[p.icon]}
                </div>
                <div>
                  <div
                    className="font-bold text-[22px]"
                    style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
                  >
                    {p.title}
                  </div>
                  <div
                    className="text-[12px] mt-0.5"
                    style={{ fontFamily: "var(--font-jetbrains)", color: "#9098AE" }}
                  >
                    {p.tag}
                  </div>
                </div>
              </div>
              <p className="text-[15.5px] leading-[1.65]" style={{ color: "#4C566F" }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* ===== WHY PARTNER ===== */}
      <Container as="section" className="py-[60px]">
        <div
          className="rounded-[24px] p-12"
          style={{
            background: "#fff",
            border: "1px solid #E7EAF3",
            boxShadow: "0 10px 30px rgba(11,18,38,.04)",
          }}
        >
          <div className="max-w-[560px] mb-10">
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#2F5BFF" }}
            >
              Why partner with Fonex
            </div>
            <h2
              className="font-extrabold"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 34,
                lineHeight: 1.14,
                letterSpacing: "-.025em",
                color: "#0B1226",
              }}
            >
              A supplier your business can build on
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerBenefits.map((b) => (
              <div key={b.title} className="flex gap-3.5 items-start">
                <span
                  className="inline-flex items-center justify-center rounded-[9px] flex-shrink-0 mt-0.5"
                  style={{
                    width: 28,
                    height: 28,
                    background: "#EEF1FB",
                    color: "#2F5BFF",
                  }}
                >
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <div>
                  <div
                    className="font-bold text-[16.5px] mb-1"
                    style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
                  >
                    {b.title}
                  </div>
                  <div className="text-[14px] leading-[1.55]" style={{ color: "#5A6480" }}>
                    {b.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* ===== CTA ===== */}
      <Container as="section" className="mb-20">
        <CtaBand
          title="Let's grow together"
          subtitle="Whether you're a retailer, manufacturer, or community organization, we'd love to explore how we can work together."
          primaryLabel="Start a Conversation"
          primaryHref="/contact"
        />
      </Container>
    </div>
  );
}
