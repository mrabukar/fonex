import type { Metadata } from "next";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { contactInfo, siteConfig } from "@/lib/content";
import { ContactForm } from "./contact-form";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Fonex Supply Limited. We'd love to hear from you.",
};

const iconMap: Record<string, React.ReactNode> = {
  "map-pin": <MapPin size={20} strokeWidth={2} />,
  phone: <Phone size={20} strokeWidth={2} />,
  mail: <Mail size={20} strokeWidth={2} />,
  globe: <Globe size={20} strokeWidth={2} />,
};

export default function ContactPage() {
  return (
    <div>
      {/* ===== HEADER ===== */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E7EAF3" }}>
        <Container className="pt-14 pb-11">
          <FadeIn>
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#2F5BFF" }}
            >
              Get in touch
            </div>
            <h1
              className="font-extrabold text-balance max-w-170"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: "clamp(36px, 4vw, 48px)",
                lineHeight: 1.08,
                letterSpacing: "-.03em",
                color: "#0B1226",
              }}
            >
              Let&apos;s talk about what you need
            </h1>
            <p
              className="text-[17.5px] leading-[1.6] max-w-145 mt-4"
              style={{ color: "#4C566F" }}
            >
              Whether you&apos;re a customer, a retailer, or a potential partner — we&apos;d love to
              hear from you. Reach out and we&apos;ll respond promptly.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ===== MAIN SECTION ===== */}
      <Container as="section" className="py-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-8 items-start">
          {/* Info card */}
          <FadeIn direction="left">
            <div
              className="relative overflow-hidden rounded-[24px] p-10"
              style={{ background: "linear-gradient(155deg,#0B1226,#1C2A55)", color: "#fff" }}
            >
              <div
                className="absolute"
                style={{
                  top: -40,
                  right: -40,
                  width: 220,
                  height: 220,
                  border: "1.5px solid rgba(255,255,255,.1)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: 10,
                  right: 20,
                  width: 140,
                  height: 140,
                  border: "1.5px solid rgba(255,255,255,.08)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              <div className="relative">
                <div
                  className="font-extrabold text-[24px] mb-2"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  {siteConfig.name}
                </div>
                <p className="text-[15px] leading-[1.6] mb-8 max-w-75" style={{ color: "#A9B2CC" }}>
                  Your trusted mobile technology supplier in East Africa.
                </p>

                <div className="flex flex-col gap-5">
                  {contactInfo.map((c) => (
                    <div key={c.label} className="flex items-center gap-4">
                      <span
                        className="inline-flex items-center justify-center rounded-[13px] shrink-0"
                        style={{
                          width: 46,
                          height: 46,
                          background: "rgba(255,255,255,.08)",
                          border: "1px solid rgba(255,255,255,.12)",
                          color: "#16C2D5",
                        }}
                      >
                        {iconMap[c.icon]}
                      </span>
                      <div>
                        <div
                          className="text-[12px] font-semibold tracking-[.04em] uppercase mb-0.5"
                          style={{ color: "#8B97C4" }}
                        >
                          {c.label}
                        </div>
                        <div
                          className="text-[16px] font-semibold text-white"
                          style={c.mono ? { fontFamily: "var(--font-jetbrains)" } : {}}
                        >
                          {c.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-8 pt-6"
                  style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}
                >
                  <div
                    className="text-[12px] font-semibold tracking-[.04em] uppercase mb-2"
                    style={{ color: "#8B97C4" }}
                  >
                    Business hours
                  </div>
                  <div className="flex justify-between text-[14.5px] mb-1.5" style={{ color: "#C3CADD" }}>
                    <span>Saturday – Thursday</span>
                    <span className="font-semibold text-white">8:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between text-[14.5px]" style={{ color: "#C3CADD" }}>
                    <span>Friday</span>
                    <span className="font-semibold text-white">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Form card */}
          <FadeIn direction="right" delay={0.08}>
            <div
              className="rounded-[24px] p-10"
              style={{
                background: "#fff",
                border: "1px solid #E7EAF3",
                boxShadow: "0 10px 30px rgba(11,18,38,.05)",
              }}
            >
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
