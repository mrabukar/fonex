import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/content";
import { Container } from "@/components/container";

export function Footer() {
  return (
    <footer style={{ background: "#0B1226", color: "#fff" }}>
      <Container className="pt-16 pb-8 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span
              className="inline-flex items-end justify-center gap-[2px] rounded-[10px]"
              style={{
                width: 34,
                height: 34,
                background: "linear-gradient(135deg,#1A1C74,#F5A623)",
                padding: "8px 7px",
              }}
              aria-hidden
            >
              <span style={{ width: 3.5, height: 8, background: "#fff", borderRadius: 2, opacity: 0.7, display: "block" }} />
              <span style={{ width: 3.5, height: 12, background: "#fff", borderRadius: 2, opacity: 0.85, display: "block" }} />
              <span style={{ width: 3.5, height: 17, background: "#fff", borderRadius: 2, display: "block" }} />
            </span>
            <span
              className="font-extrabold text-[19px]"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Fonex
            </span>
          </div>
          <p className="text-[14.5px] leading-[1.65] max-w-[300px]" style={{ color: "#9AA3BE" }}>
            Premier supplier of smartphones, mobile devices, and accessories — connecting East Africa
            to authentic global technology.
          </p>
        </div>

        {/* Explore */}
        <div>
          <div
            className="font-bold text-[13px] tracking-[.06em] uppercase mb-4"
            style={{ color: "#6F7A9B", fontFamily: "var(--font-sora)" }}
          >
            Explore
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[14.5px] mb-2.5 transition-colors hover:text-white"
              style={{ color: "#C3CADD" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Products */}
        <div>
          <div
            className="font-bold text-[13px] tracking-[.06em] uppercase mb-4"
            style={{ color: "#6F7A9B", fontFamily: "var(--font-sora)" }}
          >
            Products
          </div>
          {["Flagship Smartphones", "Mid-Range Devices", "Accessories", "Smart Wearables"].map(
            (item) => (
              <div key={item} className="text-[14.5px] mb-2.5" style={{ color: "#C3CADD" }}>
                {item}
              </div>
            )
          )}
        </div>

        {/* Contact */}
        <div>
          <div
            className="font-bold text-[13px] tracking-[.06em] uppercase mb-4"
            style={{ color: "#6F7A9B", fontFamily: "var(--font-sora)" }}
          >
            Get in touch
          </div>
          <div className="text-[14.5px] mb-2.5" style={{ color: "#C3CADD" }}>
            {siteConfig.address}
          </div>
          <div
            className="text-[14.5px] mb-2.5"
            style={{ color: "#C3CADD", fontFamily: "var(--font-jetbrains)" }}
          >
            {siteConfig.phone}
          </div>
          <div className="text-[14.5px] mb-2.5" style={{ color: "#C3CADD" }}>
            {siteConfig.email}
          </div>
          <div className="text-[14.5px]" style={{ color: "#C3CADD" }}>
            {siteConfig.website}
          </div>
        </div>
      </Container>

      <div style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <Container className="py-5 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[13px]" style={{ color: "#6F7A9B" }}>
            {siteConfig.copyright}
          </span>
          <span className="text-[13px]" style={{ color: "#6F7A9B" }}>
            Established {siteConfig.established} · {siteConfig.address}
          </span>
        </Container>
      </div>
    </footer>
  );
}
