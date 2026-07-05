"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneGraphic } from "@/components/graphics/phone-graphic";

type Concept = "A" | "B" | "C";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const heroWrap = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease } },
};

function tabBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "#0B1226" : "transparent",
    color: active ? "#fff" : "#7B8499",
    border: "none",
    fontFamily: "var(--font-manrope)",
    fontWeight: 700,
    fontSize: 12.5,
    padding: "7px 16px",
    borderRadius: 999,
    cursor: "pointer",
  };
}

/* ── Tab Bar ──────────────────────────────────────────────────── */
function ConceptTabs({
  active,
  onChange,
}: {
  active: Concept;
  onChange: (c: Concept) => void;
}) {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "18px 28px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 12,
      }}
    >
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "#9098AE",
        }}
      >
        Hero layout
      </span>
      <div
        style={{
          display: "inline-flex",
          background: "#fff",
          border: "1px solid #E7EAF3",
          borderRadius: 999,
          padding: 4,
          boxShadow: "0 4px 14px rgba(11,18,38,.05)",
        }}
      >
        {(["A", "B", "C"] as Concept[]).map((c) => (
          <button key={c} onClick={() => onChange(c)} style={tabBtnStyle(active === c)}>
            {c === "A" ? "A · Editorial" : c === "B" ? "B · Centered" : "C · Premium"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── A · Editorial Split ──────────────────────────────────────── */
function HeroA() {
  return (
    <section className="max-w-[1200px] mx-auto px-7 pt-[34px] pb-[70px] grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-12 items-center">
      <motion.div variants={heroContainer} initial="hidden" animate="visible">
        <motion.div variants={heroItem}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#EEF1FB",
              border: "1px solid #DCE2FA",
              color: "#1A1C74",
              fontWeight: 700,
              fontSize: 12.5,
              letterSpacing: ".04em",
              padding: "7px 14px",
              borderRadius: 999,
              marginBottom: 24,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5A623", display: "block" }} />
            EST. 2025 · MOGADISHU, SOMALIA
          </div>
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="text-balance"
          style={{
            fontFamily: "var(--font-sora)",
            fontWeight: 800,
            fontSize: 58,
            lineHeight: 1.04,
            letterSpacing: "-.03em",
            color: "#0B1226",
            marginBottom: 22,
          }}
        >
          Authentic mobile technology,{" "}
          <span
            style={{
              background: "linear-gradient(115deg,#1A1C74,#F5A623)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            delivered across East Africa.
          </span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          style={{ fontSize: 18, lineHeight: 1.6, color: "#4C566F", maxWidth: 500, marginBottom: 32 }}
        >
          Fonex Supply Limited imports and distributes genuine smartphones, accessories, and spare
          parts — connecting people, businesses, and communities to the devices that move them
          forward.
        </motion.p>

        <motion.div
          variants={heroItem}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}
        >
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#1A1C74",
              color: "#fff",
              fontFamily: "var(--font-manrope)",
              fontWeight: 700,
              fontSize: 16,
              padding: "15px 26px",
              borderRadius: 13,
              boxShadow: "0 12px 28px rgba(26,28,116,.32)",
              textDecoration: "none",
            }}
          >
            Browse Products <span style={{ fontSize: 18 }}>→</span>
          </Link>
          <Link
            href="/partnerships"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#fff",
              color: "#0B1226",
              border: "1px solid #DFE3EE",
              fontFamily: "var(--font-manrope)",
              fontWeight: 700,
              fontSize: 16,
              padding: "15px 26px",
              borderRadius: 13,
              textDecoration: "none",
            }}
          >
            Become a Partner
          </Link>
        </motion.div>

        <motion.div variants={heroItem} style={{ display: "flex", gap: 34, flexWrap: "wrap" }}>
          {[
            { value: "100%", label: "Authentic stock" },
            { value: "6+", label: "Cities served" },
            { value: "24/7", label: "After-sales support" },
          ].map((stat, i) => (
            <>
              {i > 0 && <div key={`div-${i}`} style={{ width: 1, background: "#E7EAF3" }} />}
              <div key={stat.value}>
                <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 26, color: "#0B1226" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13.5, color: "#7B8499" }}>{stat.label}</div>
              </div>
            </>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="hidden lg:block"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease }}
      >
        <PhoneGraphic />
      </motion.div>
    </section>
  );
}

/* ── B · Centered Bold ────────────────────────────────────────── */
function HeroB() {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "60px 28px 80px" }}>
      {/* dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, #DDE2F0 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          opacity: 0.6,
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 30%, #000, transparent 75%)",
          maskImage: "radial-gradient(70% 60% at 50% 30%, #000, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 360,
          background: "radial-gradient(50% 50% at 50% 50%, rgba(26,28,116,.18), transparent 70%)",
        }}
      />

      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        style={{ position: "relative", maxWidth: 880, margin: "0 auto", textAlign: "center" }}
      >
        <motion.div variants={heroItem}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#fff",
              border: "1px solid #E2E6F2",
              color: "#1A1C74",
              fontWeight: 700,
              fontSize: 12.5,
              letterSpacing: ".04em",
              padding: "8px 16px",
              borderRadius: 999,
              marginBottom: 26,
              boxShadow: "0 4px 14px rgba(11,18,38,.05)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5A623", display: "block" }} />
            YOUR TRUSTED MOBILE SUPPLY PARTNER
          </div>
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="text-balance"
          style={{
            fontFamily: "var(--font-sora)",
            fontWeight: 800,
            fontSize: 66,
            lineHeight: 1.02,
            letterSpacing: "-.035em",
            color: "#0B1226",
            marginBottom: 24,
          }}
        >
          The devices that{" "}
          <span
            style={{
              background: "linear-gradient(115deg,#1A1C74,#F5A623)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            power progress
          </span>
          , supplied with confidence.
        </motion.h1>

        <motion.p
          variants={heroItem}
          style={{ fontSize: 19, lineHeight: 1.6, color: "#4C566F", maxWidth: 600, margin: "0 auto 34px" }}
        >
          From flagship smartphones to everyday accessories and spare parts — Fonex delivers
          authentic mobile technology to retailers, businesses, and people across East Africa.
        </motion.p>

        <motion.div
          variants={heroItem}
          style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#1A1C74",
              color: "#fff",
              fontFamily: "var(--font-manrope)",
              fontWeight: 700,
              fontSize: 16,
              padding: "15px 28px",
              borderRadius: 13,
              boxShadow: "0 12px 28px rgba(26,28,116,.32)",
              textDecoration: "none",
            }}
          >
            Browse Products <span style={{ fontSize: 18 }}>→</span>
          </Link>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#fff",
              color: "#0B1226",
              border: "1px solid #DFE3EE",
              fontFamily: "var(--font-manrope)",
              fontWeight: 700,
              fontSize: 16,
              padding: "15px 28px",
              borderRadius: 13,
              textDecoration: "none",
            }}
          >
            Request a Quote
          </Link>
        </motion.div>
      </motion.div>

      {/* 3 device cards */}
      <motion.div
        className="hidden sm:flex"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease }}
        style={{
          position: "relative",
          maxWidth: 760,
          margin: "54px auto 0",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 150, height: 200, borderRadius: 22,
            background: "linear-gradient(160deg,#fff,#F1F4FC)",
            border: "1px solid #E7EAF3",
            boxShadow: "0 24px 50px -18px rgba(11,18,38,.22)",
            padding: 16, flexShrink: 0,
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#F5A623,#13A6C0)", marginBottom: 14 }} />
          <div style={{ height: 8, width: "70%", background: "#E7EAF3", borderRadius: 4, marginBottom: 7 }} />
          <div style={{ height: 8, width: "50%", background: "#EEF1FB", borderRadius: 4 }} />
        </div>

        <div
          style={{
            width: 188, height: 268, borderRadius: 26,
            background: "#0B1226",
            boxShadow: "0 36px 70px -22px rgba(11,18,38,.5)",
            padding: 14, flexShrink: 0,
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: 18, background: "linear-gradient(160deg,#1A1C74,#F5A623)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 40% at 30% 20%, rgba(255,255,255,.35), transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
              <div style={{ height: 9, width: "60%", background: "rgba(255,255,255,.7)", borderRadius: 5, marginBottom: 8 }} />
              <div style={{ height: 9, width: "85%", background: "rgba(255,255,255,.35)", borderRadius: 5 }} />
            </div>
          </div>
        </div>

        <div
          style={{
            width: 150, height: 200, borderRadius: 22,
            background: "linear-gradient(160deg,#fff,#F1F4FC)",
            border: "1px solid #E7EAF3",
            boxShadow: "0 24px 50px -18px rgba(11,18,38,.22)",
            padding: 16, flexShrink: 0,
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#F5A623,#F59300)", marginBottom: 14 }} />
          <div style={{ height: 8, width: "70%", background: "#E7EAF3", borderRadius: 4, marginBottom: 7 }} />
          <div style={{ height: 8, width: "50%", background: "#EEF1FB", borderRadius: 4 }} />
        </div>
      </motion.div>
    </section>
  );
}

/* ── C · Dark Premium ─────────────────────────────────────────── */
function HeroC() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "#0B1226" }}>
      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(50% 60% at 78% 30%, rgba(26,28,116,.42), transparent 65%), radial-gradient(45% 55% at 20% 80%, rgba(245,166,35,.34), transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-7 pt-[60px] pb-[72px] grid grid-cols-1 lg:grid-cols-[1.08fr_.92fr] gap-11 items-center">
        <motion.div variants={heroContainer} initial="hidden" animate="visible">
          <motion.div variants={heroItem}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "rgba(255,255,255,.07)",
                border: "1px solid rgba(255,255,255,.14)",
                color: "#BFC8E4",
                fontWeight: 700,
                fontSize: 12.5,
                letterSpacing: ".04em",
                padding: "8px 15px",
                borderRadius: 999,
                marginBottom: 26,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5A623", display: "block" }} />
              IMPORTING · DISTRIBUTING · DELIVERING
            </div>
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="text-balance"
            style={{
              fontFamily: "var(--font-sora)",
              fontWeight: 800,
              fontSize: 60,
              lineHeight: 1.04,
              letterSpacing: "-.03em",
              color: "#fff",
              marginBottom: 22,
            }}
          >
            Mobile technology you can{" "}
            <span style={{ color: "#F5A623" }}>trust</span>, supply you can rely on.
          </motion.h1>

          <motion.p
            variants={heroItem}
            style={{ fontSize: 18, lineHeight: 1.6, color: "#A9B2CC", maxWidth: 500, marginBottom: 34 }}
          >
            Fonex Supply Limited is one of Somalia&apos;s first dedicated mobile supply companies
            — bringing authentic smartphones, accessories, and spare parts to East Africa&apos;s
            growing digital economy.
          </motion.p>

          <motion.div variants={heroItem} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "#1A1C74",
                color: "#fff",
                fontFamily: "var(--font-manrope)",
                fontWeight: 700,
                fontSize: 16,
                padding: "15px 26px",
                borderRadius: 13,
                boxShadow: "0 12px 30px rgba(26,28,116,.45)",
                textDecoration: "none",
              }}
            >
              Browse Products <span style={{ fontSize: 18 }}>→</span>
            </Link>
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.18)",
                fontFamily: "var(--font-manrope)",
                fontWeight: 700,
                fontSize: 16,
                padding: "15px 26px",
                borderRadius: 13,
                textDecoration: "none",
              }}
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        {/* right — dark phone */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          style={{ position: "relative", height: 460 }}
        >
          <div
            className="animate-float"
            style={{
              position: "absolute",
              top: 40,
              left: "50%",
              transform: "translateX(-50%)",
              width: 230,
              height: 466,
              background: "#05080F",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 38,
              padding: 11,
              boxShadow: "0 50px 90px -30px rgba(0,0,0,.7)",
            }}
          >
            <div
              style={{
                width: "100%", height: "100%", borderRadius: 28,
                background: "linear-gradient(160deg,#16224A,#0B1226)",
                overflow: "hidden", position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 90, height: 20, background: "#05080F", borderRadius: 999 }} />
              <div style={{ padding: "44px 18px" }}>
                <div style={{ height: 120, borderRadius: 16, background: "linear-gradient(135deg,#1A1C74,#F5A623)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 50% at 70% 20%, rgba(255,255,255,.4), transparent 60%)" }} />
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 9 }}>
                  <div style={{ flex: 1, height: 54, borderRadius: 13, background: "rgba(255,255,255,.06)" }} />
                  <div style={{ flex: 1, height: 54, borderRadius: 13, background: "rgba(245,166,35,.18)", border: "1px solid rgba(245,166,35,.3)" }} />
                </div>
                <div style={{ marginTop: 12, height: 9, width: "70%", background: "rgba(255,255,255,.14)", borderRadius: 5 }} />
                <div style={{ marginTop: 9, height: 9, width: "48%", background: "rgba(255,255,255,.09)", borderRadius: 5 }} />
              </div>
            </div>
          </div>

          <div
            className="animate-float-2"
            style={{
              position: "absolute",
              top: 90,
              right: 6,
              background: "rgba(255,255,255,.07)",
              border: "1px solid rgba(255,255,255,.14)",
              borderRadius: 14,
              padding: "12px 15px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div style={{ fontSize: 11, color: "#9AA3BE", fontWeight: 600 }}>Authentic</div>
            <div style={{ fontFamily: "var(--font-sora)", fontWeight: 800, fontSize: 16, color: "#fff" }}>Global brands</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Switcher (exported) ──────────────────────────────────────── */
export function HeroSwitcher() {
  const [active, setActive] = useState<Concept>("A");

  return (
    <div>
      {/* <ConceptTabs active={active} onChange={setActive} /> */}
      <AnimatePresence mode="wait">
        <motion.div key={active} {...heroWrap}>
          {active === "A" && <HeroA />}
          {active === "B" && <HeroB />}
          {active === "C" && <HeroC />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

