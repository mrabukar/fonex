import type { Metadata } from "next";
import Link from "next/link";
import { HeroSwitcher } from "@/components/hero-switcher";
import { CtaBand } from "@/components/cta-band";
import { services } from "@/lib/content";
import { Container } from "@/components/container";
import {
  Smartphone,
  Layers,
  Headphones,
  Watch,
  Wrench,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Fonex Supply Limited — authentic mobile technology delivered across East Africa.",
};

const iconMap: Record<string, React.ReactNode> = {
  phone: <Smartphone size={24} strokeWidth={2} />,
  layers: <Layers size={24} strokeWidth={2} />,
  headphones: <Headphones size={24} strokeWidth={2} />,
  watch: <Watch size={24} strokeWidth={2} />,
  wrench: <Wrench size={24} strokeWidth={2} />,
  "check-circle": <CheckCircle size={24} strokeWidth={2} />,
};

export default function HomePage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <HeroSwitcher />

      {/* ===== TRUST STRIP ===== */}
      <section
        style={{
          background: "#fff",
          borderTop: "1px solid #E7EAF3",
          borderBottom: "1px solid #E7EAF3",
        }}
      >
        <Container className="py-6 flex items-center gap-8 flex-wrap justify-between">
          <span
            className="text-[13px] font-bold tracking-[.08em] uppercase whitespace-nowrap"
            style={{ color: "#9098AE" }}
          >
            Authentic stock from leading global brands
          </span>
          <div className="flex items-center gap-10 flex-wrap">
            {[
              "Flagship",
              "Mid-Range",
              "Accessories",
              "Wearables",
              "Spare Parts",
            ].map((cat) => (
              <span
                key={cat}
                className="font-extrabold text-[19px]"
                style={{
                  fontFamily: "var(--font-sora)",
                  color: "#AEB6CA",
                  letterSpacing: "-.02em",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <Container as="section" className="pt-20 pb-8">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div className="max-w-[560px]">
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#2F5BFF" }}
            >
              What we supply
            </div>
            <h2
              className="font-extrabold text-balance"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 40,
                lineHeight: 1.1,
                letterSpacing: "-.025em",
                color: "#0B1226",
              }}
            >
              Everything mobile, from one trusted source
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-bold text-[15px] px-5 py-3.5 rounded-[12px] transition-colors hover:border-[#2F5BFF] hover:text-[#2F5BFF] whitespace-nowrap"
            style={{
              background: "#fff",
              border: "1px solid #DFE3EE",
              color: "#0B1226",
              fontFamily: "var(--font-manrope)",
            }}
          >
            View all products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-[18px] p-6 transition-colors"
              style={{
                background: "#fff",
                border: "1px solid #E7EAF3",
                boxShadow: "0 6px 18px rgba(11,18,38,.04)",
              }}
            >
              <div
                className="inline-flex items-center justify-center rounded-[14px]"
                style={{
                  width: 52,
                  height: 52,
                  background: s.tint,
                  color: s.accent,
                }}
              >
                {iconMap[s.icon]}
              </div>
              <div
                className="font-bold text-[19px] mt-4 mb-2"
                style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
              >
                {s.title}
              </div>
              <div
                className="text-[14.5px] leading-[1.6]"
                style={{ color: "#5A6480" }}
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ===== MISSION SPLIT ===== */}
      <Container as="section" className="py-[70px]">
        <div
          className="grid grid-cols-1 lg:grid-cols-[.92fr_1.08fr] gap-12 items-center rounded-[24px] p-11"
          style={{
            background: "#fff",
            border: "1px solid #E7EAF3",
            boxShadow: "0 10px 30px rgba(11,18,38,.04)",
          }}
        >
          {/* Dark visual panel */}
          <div
            className="relative rounded-[18px] overflow-hidden"
            style={{
              height: 330,
              background: "linear-gradient(150deg,#0B1226,#1C2A55)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 50% at 75% 25%, rgba(47,91,255,.5), transparent 60%), radial-gradient(45% 45% at 25% 80%, rgba(22,194,213,.4), transparent 60%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute bottom-6 left-6 right-6">
              <div
                className="font-extrabold text-white"
                style={{
                  fontFamily: "var(--font-sora)",
                  fontSize: 30,
                  letterSpacing: "-.02em",
                  lineHeight: 1.1,
                }}
              >
                Digital inclusion, by design
              </div>
              <div className="text-[14px] mt-2" style={{ color: "#A9B2CC" }}>
                Connecting students, entrepreneurs & businesses to technology.
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#2F5BFF" }}
            >
              Our mission
            </div>
            <h2
              className="font-extrabold text-balance mb-5"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 34,
                lineHeight: 1.15,
                letterSpacing: "-.025em",
                color: "#0B1226",
              }}
            >
              Empowering people and businesses through reliable mobile
              technology
            </h2>
            <p
              className="text-[16.5px] leading-[1.65] mb-6"
              style={{ color: "#4C566F" }}
            >
              We supply innovative smartphones, accessories, and spare parts
              that enhance communication, productivity, and digital inclusion —
              helping East Africa adapt and thrive in a connected world.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { color: "#2F5BFF", text: "Authentic, warrantied products" },
                { color: "#16C2D5", text: "Reliable regional distribution" },
                { color: "#6C5CE7", text: "Competitive partner pricing" },
                { color: "#FFB020", text: "Dependable after-sales support" },
              ].map((item) => (
                <div key={item.text} className="flex gap-2.5 items-start">
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: item.color,
                      marginTop: 6,
                      flexShrink: 0,
                      display: "block",
                    }}
                  />
                  <span
                    className="text-[15px] font-semibold"
                    style={{ color: "#27314B" }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* ===== CTA BAND ===== */}
      <Container as="section" className="mb-20">
        <CtaBand
          title="Ready to stock authentic devices your customers can trust?"
          subtitle="Partner with Fonex for genuine products, competitive pricing, and dependable supply across East Africa."
          primaryLabel="Request a Quote"
          primaryHref="/contact"
          secondaryLabel="Become a Partner"
          secondaryHref="/partnerships"
        />
      </Container>
    </div>
  );
}
