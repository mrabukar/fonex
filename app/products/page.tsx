import type { Metadata } from "next";
import { ProductsGrid } from "./products-grid";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Products & Services",
  description:
    "Browse our range of authentic mobile technology — flagship smartphones, mid-range devices, accessories, wearables, and spare parts.",
};

export default function ProductsPage() {
  return (
    <div>
      {/* ===== HEADER ===== */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E7EAF3" }}>
        <Container className="pt-14 pb-10">
          <div
            className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
            style={{ color: "#2F5BFF" }}
          >
            Products & Services
          </div>
          <h1
            className="font-extrabold text-balance max-w-[720px]"
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: "clamp(36px, 4vw, 48px)",
              lineHeight: 1.08,
              letterSpacing: "-.03em",
              color: "#0B1226",
            }}
          >
            Browse our range of authentic mobile technology
          </h1>
          <p
            className="text-[17.5px] leading-[1.6] max-w-[600px] mt-4"
            style={{ color: "#4C566F" }}
          >
            From flagship smartphones to everyday accessories, every product we supply is genuine,
            quality-checked, and backed by after-sales support.
          </p>
        </Container>
      </section>

      {/* ===== FILTERABLE GRID (client) ===== */}
      <ProductsGrid />

      {/* ===== SERVICES BAND ===== */}
      <Container as="section" className="pb-20 pt-10">
        <div
          className="relative overflow-hidden rounded-[24px] p-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          style={{ background: "linear-gradient(135deg,#0B1226,#1C2A55)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(40% 70% at 90% 20%, rgba(47,91,255,.3), transparent 60%)",
            }}
          />
          <div className="relative md:col-span-3 mb-2">
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-2.5"
              style={{ color: "#8B97C4" }}
            >
              Beyond the products
            </div>
            <h2
              className="font-extrabold text-white"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: 30,
                letterSpacing: "-.02em",
              }}
            >
              Services that keep you supplied
            </h2>
          </div>
          {[
            {
              title: "Import & Distribution",
              body: "Sourcing authentic devices directly from global manufacturers and moving them across the region.",
            },
            {
              title: "Wholesale Supply",
              body: "Reliable stock and competitive pricing for local retailers and business partners.",
            },
            {
              title: "After-Sales Support",
              body: "Spare parts and dependable service that keep devices running long after purchase.",
            },
          ].map((s) => (
            <div key={s.title} className="relative">
              <div
                className="font-bold text-[18px] mb-2"
                style={{ color: "#16C2D5", fontFamily: "var(--font-sora)" }}
              >
                {s.title}
              </div>
              <div className="text-[14.5px] leading-[1.6]" style={{ color: "#A9B2CC" }}>
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
