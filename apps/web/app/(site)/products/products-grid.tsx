"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { colorFamilyForId } from "@/lib/content";
import { DeviceTile } from "@/components/graphics/device-tile";
import { Container } from "@/components/container";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { ApiError, fetchAllPages } from "@/lib/api-client";
import { humanize } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

function statusStyle(status: Product["status"]): React.CSSProperties {
  if (status === "in_stock") return { background: "#E2F6EF", color: "#067A55" };
  if (status === "limited") return { background: "#FFF1D6", color: "#9A6400" };
  return { background: "#E7E8F5", color: "#12144F" };
}

const FILTER_SKELETON_WIDTHS = [116, 92, 132, 104, 124, 96];

function FilterPillsSkeleton() {
  return (
    <div className="flex gap-2.5">
      {FILTER_SKELETON_WIDTHS.map((width, i) => (
        <div key={i} className="pill-skeleton" style={{ width, height: 41 }} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{
        background: "#fff",
        border: "1px solid #E7EAF3",
        boxShadow: "0 6px 18px rgba(11,18,38,.04)",
      }}
    >
      <div className="skeleton-shimmer" style={{ height: 200 }} />
      <div className="p-6">
        <div className="skeleton-shimmer rounded-full" style={{ height: 19, width: "60%", marginBottom: 12 }} />
        <div className="skeleton-shimmer rounded-full" style={{ height: 12, width: "100%", marginBottom: 8 }} />
        <div className="skeleton-shimmer rounded-full" style={{ height: 12, width: "75%" }} />
      </div>
    </div>
  );
}

const PRODUCT_SKELETON_COUNT = 6;

export function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cat, setCat] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollButtons() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  function scrollByAmount(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchAllPages<Product>("/api/products", {}),
      fetchAllPages<Category>("/api/categories", {}),
    ])
      .then(([productRows, categoryRows]) => {
        if (cancelled) return;
        setProducts(productRows);
        setCategories(categoryRows);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load products");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const filters = [
    { key: "all", label: "All Products" },
    ...sortedCategories.map((c) => ({ key: c.slug, label: c.name })),
  ];
  const visible = cat === "all" ? products : products.filter((p) => p.category.slug === cat);

  useEffect(() => {
    if (loading) return;
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [loading, filters.length]);

  return (
    <>
      {/* Filter bar */}
      <Container className="pt-9 pb-2">
        {loading ? (
          <FilterPillsSkeleton />
        ) : (
          <div className="relative">
            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll categories left"
                onClick={() => scrollByAmount(-1)}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 size-8 items-center justify-center rounded-full"
                style={{
                  background: "#fff",
                  color: "#1A1C74",
                  border: "1px solid #E7EAF3",
                  boxShadow: "0 6px 16px rgba(11,18,38,.12)",
                  cursor: "pointer",
                }}
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <div
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {filters.map((f) => {
                const active = cat === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setCat(f.key)}
                    className="shrink-0 font-bold text-[14px] px-[18px] py-2.5 rounded-full transition-colors"
                    style={{
                      border: `1px solid ${active ? "#1A1C74" : "#DFE3EE"}`,
                      background: active ? "#1A1C74" : "#fff",
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
            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll categories right"
                onClick={() => scrollByAmount(1)}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 size-8 items-center justify-center rounded-full"
                style={{
                  background: "#fff",
                  color: "#1A1C74",
                  border: "1px solid #E7EAF3",
                  boxShadow: "0 6px 16px rgba(11,18,38,.12)",
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </Container>

      {/* Grid */}
      <Container as="section" className="pt-10 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PRODUCT_SKELETON_COUNT }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div
            className="text-center py-20 text-[15px]"
            style={{ color: "#5A6480", fontFamily: "var(--font-manrope)" }}
          >
            No products found in this category.
          </div>
        ) : (
          <StaggerContainer
            staggerKey={cat}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map((p) => (
              <StaggerItem
                key={p.id}
                hover
                className="rounded-[20px] overflow-hidden"
                style={{
                  background: "#fff",
                  border: "1px solid #E7EAF3",
                  boxShadow: "0 6px 18px rgba(11,18,38,.04)",
                }}
              >
                <Link href={`/products/${p.id}`} className="block">
                  {/* Visual */}
                  <div className="relative">
                    <DeviceTile
                      fam={colorFamilyForId(p.id)}
                      type={p.type}
                      img={p.imageUrl ?? undefined}
                    />
                    {/* Category chip */}
                    <span
                      className="absolute top-3.5 left-3.5 text-[11.5px] font-bold px-2.5 py-1.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,.9)",
                        color: "#27314B",
                        letterSpacing: ".02em",
                      }}
                    >
                      {p.category.name}
                    </span>
                    {/* Status pill */}
                    <span
                      className="absolute top-3.5 right-3.5 text-[11.5px] font-bold px-2.5 py-1.5 rounded-full"
                      style={statusStyle(p.status)}
                    >
                      {humanize(p.status)}
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
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <div
                        className="line-clamp-1 min-w-0 flex-1 text-[14px] leading-[1.55]"
                        style={{ color: "#5A6480" }}
                      >
                        {p.description || "View details"}
                      </div>
                      <span
                        className="shrink-0 whitespace-nowrap text-[13px] font-bold"
                        style={{ color: "#1A1C74" }}
                      >
                        See more
                      </span>
                    </div>
                    {/* Enquire / Price on request — hidden until the enquiry backend flow is built (see docs/products-and-enquiries-plan.md §5)
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
                      className="font-bold text-[13.5px] px-4 py-2.5 rounded-[10px] transition-colors hover:bg-[#1A1C74] hover:text-white"
                      style={{
                        background: "#EEF1FB",
                        color: "#1A1C74",
                        fontFamily: "var(--font-manrope)",
                      }}
                    >
                      Enquire →
                    </Link>
                  </div>
                  */}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </>
  );
}
