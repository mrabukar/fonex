"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";
import { isLegacyHomepageImage } from "@/lib/crop-image";
import type { PublicHomepageSlide } from "@/lib/types";

const TRANSITION_S = 1;
const PEEK = 6;
const GAP = 1.5;
const SLIDE_WIDTH = 100 - PEEK * 2 - GAP;
const STEP = SLIDE_WIDTH + GAP;

export function FeaturedDevices({
  slides,
  autoplayMs = 3000,
}: {
  slides: PublicHomepageSlide[];
  autoplayMs?: number;
}) {
  const visible = useMemo(
    () => slides.filter((slide) => Boolean(slide.imageUrl)),
    [slides],
  );
  const total = visible.length;
  const looping = total > 1;
  const extended = useMemo(() => {
    if (!looping) return visible;
    return [visible[total - 1], ...visible, visible[0]];
  }, [visible, looping, total]);

  const [renderIndex, setRenderIndex] = useState(looping ? 1 : 0);
  const [paused, setPaused] = useState(false);
  const [smooth, setSmooth] = useState(true);
  const [autoplayReady, setAutoplayReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideKey = visible.map((slide) => slide.id).join(",");
  const [seenKey, setSeenKey] = useState(slideKey);
  if (seenKey !== slideKey) {
    setSeenKey(slideKey);
    setRenderIndex(looping ? 1 : 0);
    setSmooth(true);
  }

  useEffect(() => {
    setAutoplayReady(true);
  }, []);

  useEffect(() => {
    if (!autoplayReady || !looping || paused) return;
    const wait = Number.isFinite(autoplayMs) && autoplayMs >= 1000 ? autoplayMs : 3000;
    timerRef.current = setInterval(() => {
      setRenderIndex((i) => i + 1);
    }, wait);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplayReady, paused, looping, autoplayMs]);

  useEffect(() => {
    if (!looping) return;
    if (renderIndex !== 0 && renderIndex !== extended.length - 1) return;
    const id = setTimeout(
      () => {
        setSmooth(false);
        setRenderIndex(renderIndex === 0 ? total : 1);
      },
      TRANSITION_S * 1000 + 20,
    );
    return () => clearTimeout(id);
  }, [renderIndex, looping, extended.length, total]);

  useEffect(() => {
    if (smooth) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setSmooth(true)));
    return () => cancelAnimationFrame(id);
  }, [smooth]);

  if (total === 0) return null;

  function goToReal(realIndex: number) {
    if (!looping) return;
    setSmooth(true);
    setRenderIndex(realIndex + 1);
  }

  const activeReal = looping ? (((renderIndex - 1) % total) + total) % total : 0;
  const x = looping ? PEEK - renderIndex * STEP : (100 - SLIDE_WIDTH) / 2;

  return (
    <section className="pb-10 pt-2.5">
      <FadeIn delay={0.05}>
        <div
          className="featured-devices-carousel relative w-full overflow-hidden select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex h-full"
            style={{
              gap: `${GAP}%`,
              transform: `translateX(${x}%)`,
              transition:
                smooth && looping
                  ? `transform ${TRANSITION_S}s cubic-bezier(0.21, 0.47, 0.32, 0.98)`
                  : "none",
            }}
          >
            {extended.map((slide, i) => {
              const isActive = looping ? i === renderIndex : true;
              const realIdx = looping ? (((i - 1) % total) + total) % total : 0;
              const href = isActive && slide.productId ? `/products/${slide.productId}` : null;
              const legacy = isLegacyHomepageImage(slide.imageUrl);

              const media = (
                <>
                  <Image
                    src={slide.imageUrl}
                    alt={slide.imageDescription || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1536px) 92vw, (max-width: 2560px) 1400px, 1800px"
                    unoptimized={!legacy}
                    style={{
                      objectFit: "contain",
                      padding: "4%",
                      boxSizing: "border-box",
                    }}
                    priority={i === (looping ? 1 : 0)}
                  />
                  {slide.caption ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-5 pt-16"
                      style={{
                        background: "linear-gradient(to top, rgba(11,18,38,.72), transparent)",
                      }}
                    >
                      <p
                        className="text-[15px] font-semibold text-white sm:text-[17px]"
                        style={{ fontFamily: "var(--font-manrope)" }}
                      >
                        {slide.caption}
                      </p>
                    </div>
                  ) : null}
                  {!isActive && (
                    <div
                      className="absolute inset-0"
                      style={{ background: "rgba(11,18,38,.35)" }}
                    />
                  )}
                </>
              );

              return (
                <div
                  key={`${slide.id}-${i}`}
                  className="relative h-full shrink-0 overflow-hidden rounded-[24px]"
                  style={{
                    width: `${SLIDE_WIDTH}%`,
                    background: slide.bg ?? "#fff",
                    border: "1px solid #E7EAF3",
                    boxShadow: isActive
                      ? "0 24px 56px rgba(11,18,38,.14)"
                      : "0 12px 32px rgba(11,18,38,.08)",
                    cursor: isActive ? (href ? "pointer" : "default") : "pointer",
                  }}
                  onClick={() => !isActive && goToReal(realIdx)}
                >
                  {href ? (
                    <Link
                      href={href}
                      prefetch={false}
                      className="absolute inset-0"
                      aria-label={slide.imageDescription || "View product"}
                    >
                      {media}
                    </Link>
                  ) : (
                    media
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {looping ? (
          <Container className="mt-7">
            <div className="flex justify-center gap-2.5">
              {visible.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goToReal(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === activeReal ? 28 : 10,
                    height: 10,
                    background: i === activeReal ? "#F5A623" : "#DFE3EE",
                  }}
                />
              ))}
            </div>
          </Container>
        ) : null}
      </FadeIn>
    </section>
  );
}
