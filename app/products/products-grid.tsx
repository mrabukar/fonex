"use client";

import { useState } from "react";
import Link from "next/link";
import {
  products,
  categoryFilters,
  categoryLabels,
  type ProductCategory,
} from "@/lib/content";
import { DeviceTile } from "@/components/graphics/device-tile";
import { Container } from "@/components/container";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

function statusStyle(status: string): React.CSSProperties {
  if (status === "In Stock") return { background: "#E2F6EF", color: "#067A55" };
  if (status === "Limited") return { background: "#FFF1D6", color: "#9A6400" };
  return { background: "#EFEBFC", color: "#5A3FC0" };
}

export function ProductsGrid() {
  const [cat, setCat] = useState<ProductCategory>("all");

  const visible = cat === "all" ? products : products.filter((p) => p.cat === cat);

  return (
    <>
      {/* Filter bar */}
      <Container className="pt-9 pb-2">
        <div className="flex gap-2.5 flex-wrap">
          {categoryFilters.map((f) => {
            const active = cat === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setCat(f.key as ProductCategory)}
                className="font-bold text-[14px] px-[18px] py-2.5 rounded-full transition-colors"
                style={{
                  border: `1px solid ${active ? "#2F5BFF" : "#DFE3EE"}`,
                  background: active ? "#2F5BFF" : "#fff",
                  color: active ? "#fff" : "#4C566F",
                  fontFamily: "var(--font-manrope)",
                  cursor: "pointer",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </Container>

      {/* Grid */}
      <Container as="section" className="pt-10 pb-8">
        <StaggerContainer
          staggerKey={cat}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visible.map((p) => (
            <StaggerItem
              key={p.name}
              hover
              className="rounded-[20px] overflow-hidden"
              style={{
                background: "#fff",
                border: "1px solid #E7EAF3",
                boxShadow: "0 6px 18px rgba(11,18,38,.04)",
              }}
            >
              {/* Visual */}
              <div className="relative">
                <DeviceTile fam={p.fam} type={p.type} img={p.img} />
                {/* Category chip */}
                <span
                  className="absolute top-3.5 left-3.5 text-[11.5px] font-bold px-2.5 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,.9)",
                    color: "#27314B",
                    letterSpacing: ".02em",
                  }}
                >
                  {categoryLabels[p.cat]}
                </span>
                {/* Status pill */}
                <span
                  className="absolute top-3.5 right-3.5 text-[11.5px] font-bold px-2.5 py-1.5 rounded-full"
                  style={statusStyle(p.status)}
                >
                  {p.status}
                </span>
              </div>

              {/* Info */}
              <div className="p-6">
                <div
                  className="font-bold text-[19px] mb-2"
                  style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
                >
                  {p.name}
                </div>
                <div
                  className="text-[14px] leading-[1.55] mb-4"
                  style={{ color: "#5A6480", minHeight: 43 }}
                >
                  {p.blurb}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-[12.5px]"
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      color: "#9098AE",
                    }}
                  >
                    Price on request
                  </span>
                  <Link
                    href="/contact"
                    className="font-bold text-[13.5px] px-4 py-2.5 rounded-[10px] transition-colors hover:bg-[#2F5BFF] hover:text-white"
                    style={{
                      background: "#EEF1FB",
                      color: "#2F5BFF",
                      fontFamily: "var(--font-manrope)",
                    }}
                  >
                    Enquire →
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </>
  );
}
