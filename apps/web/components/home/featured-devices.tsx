"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { featuredDevices } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";

const ease = [0.21, 0.47, 0.32, 0.98] as const;
const AUTOPLAY_MS = 3000;
// const TRANSITION_S = 0.5;
const TRANSITION_S = 1;
const PEEK = 15; // % of viewport width peeking in from each neighbor
const GAP = 2; // % gap between cards
const SLIDE_WIDTH = 100 - PEEK * 2 - GAP; // %
const STEP = SLIDE_WIDTH + GAP; // % advanced per slide

const total = featuredDevices.length;
// Clone the last slide before the first, and the first slide after the last,
// so the strip can slide seamlessly past either end before snapping back.
const extended = [
  featuredDevices[total - 1],
  ...featuredDevices,
  featuredDevices[0],
];

export function FeaturedDevices() {
  const [renderIndex, setRenderIndex] = useState(1); // 1..total → real slides 0..total-1
  const [paused, setPaused] = useState(false);
  const [smooth, setSmooth] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setRenderIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  // After sliding onto a cloned edge slide, snap back to the matching real
  // slide with the transition disabled so the loop looks seamless.
  useEffect(() => {
    if (renderIndex !== 0 && renderIndex !== extended.length - 1) return;
    const id = setTimeout(
      () => {
        setSmooth(false);
        setRenderIndex(renderIndex === 0 ? total : 1);
      },
      TRANSITION_S * 1000 + 20,
    );
    return () => clearTimeout(id);
  }, [renderIndex]);

  useEffect(() => {
    if (smooth) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setSmooth(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [smooth]);

  function goToReal(realIndex: number) {
    setSmooth(true);
    setRenderIndex(realIndex + 1);
  }

  const activeReal = (((renderIndex - 1) % total) + total) % total;
  const x = PEEK - renderIndex * STEP;

  return (
    <Container as="section" className="py-[70px]">
      <FadeIn className="flex items-end justify-between gap-6 mb-10 flex-wrap">
        <div className="max-w-[560px]">
          <div
            className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
            style={{ color: "#1A1C74" }}
          >
            Featured Devices
          </div>
          <h2
            className="font-extrabold text-balance"
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: 34,
              lineHeight: 1.15,
              letterSpacing: "-.025em",
              color: "#0B1226",
            }}
          >
            Explore some of the devices we supply
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 font-bold text-[15px] px-5 py-3.5 rounded-[12px] transition-colors hover:border-[#1A1C74] hover:text-[#1A1C74] whitespace-nowrap"
          style={{
            background: "#fff",
            border: "1px solid #DFE3EE",
            color: "#0B1226",
            fontFamily: "var(--font-manrope)",
          }}
        >
          View all products →
        </Link>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div
          className="relative overflow-hidden select-none"
          style={{ height: 420 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            className="flex h-full"
            style={{ gap: `${GAP}%` }}
            animate={{ x: `${x}%` }}
            transition={{ duration: smooth ? TRANSITION_S : 0, ease }}
          >
            {extended.map((slide, i) => {
              const isActive = i === renderIndex;
              const realIdx = (((i - 1) % total) + total) % total;
              return (
                <div
                  key={`${slide.img}-${i}`}
                  className="relative h-full shrink-0 rounded-[20px] overflow-hidden"
                  style={{
                    width: `${SLIDE_WIDTH}%`,
                    border: "1px solid #E7EAF3",
                    boxShadow: "0 16px 40px rgba(11,18,38,.08)",
                    cursor: isActive ? "default" : "pointer",
                  }}
                  onClick={() => !isActive && goToReal(realIdx)}
                >
                  <Image
                    src={slide.img}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 840px"
                    style={{ objectFit: "cover" }}
                    priority={i === 1}
                  />
                  {!isActive && (
                    <div
                      className="absolute inset-0"
                      style={{ background: "rgba(11,18,38,.45)" }}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {featuredDevices.map((s, i) => (
            <button
              key={s.img}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToReal(i)}
              className="rounded-full transition-all"
              style={{
                width: i === activeReal ? 22 : 8,
                height: 8,
                background: i === activeReal ? "#F5A623" : "#DFE3EE",
              }}
            />
          ))}
        </div>
      </FadeIn>
    </Container>
  );
}
