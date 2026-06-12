"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-[16px] overflow-hidden"
            style={{ border: "1px solid #E7EAF3", background: "#fff" }}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
              aria-expanded={isOpen}
            >
              <span
                className="font-bold text-[17px]"
                style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
              >
                {f.q}
              </span>
              <span
                className="text-[26px] leading-none flex-shrink-0 transition-transform duration-200"
                style={{
                  fontFamily: "var(--font-sora)",
                  fontWeight: 400,
                  color: isOpen ? "#2F5BFF" : "#9098AE",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? 300 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              <div className="px-6 pb-6 text-[15.5px] leading-[1.65]" style={{ color: "#4C566F" }}>
                {f.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
