"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { PaginatedResult } from "@fonex/shared";
import { colorFamilyForId } from "@/lib/content";
import { DeviceTile } from "@/components/graphics/device-tile";
import { Container } from "@/components/container";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { ApiError, apiClient, buildQueryString, fetchAllPages } from "@/lib/api-client";
import { humanize } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

function statusStyle(status: Product["status"]): React.CSSProperties {
  if (status === "in_stock") return { background: "#E2F6EF", color: "#067A55" };
  if (status === "limited") return { background: "#FFF1D6", color: "#9A6400" };
  return { background: "#E7E8F5", color: "#12144F" };
}

const FILTER_SKELETON_WIDTHS = [116, 92, 132, 104, 124, 96];
const PAGE_SIZE = 9;
const PRODUCT_SKELETON_COUNT = 6;

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

export function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cat, setCat] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersReady, setFiltersReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const catRef = useRef(cat);
  catRef.current = cat;
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

  const loadProducts = useCallback(async (category: string, nextPage: number, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const result = await apiClient.get<PaginatedResult<Product>>(
        `/api/products${buildQueryString({
          page: nextPage,
          pageSize: PAGE_SIZE,
          category: category === "all" ? undefined : category,
        })}`,
      );

      // Ignore stale responses if the user switched category mid-request.
      if (category !== catRef.current) return;

      setProducts((prev) => (append ? [...prev, ...result.data] : result.data));
      setPage(result.page);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      if (category !== catRef.current) return;
      toast.error(err instanceof ApiError ? err.message : "Failed to load products");
      if (!append) {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      }
    } finally {
      if (category !== catRef.current) return;
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchAllPages<Category>("/api/categories", {})
      .then((categoryRows) => {
        if (!cancelled) setCategories(categoryRows);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof ApiError ? err.message : "Failed to load categories");
        }
      })
      .finally(() => {
        if (!cancelled) setFiltersReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setLoadingMore(false);
    void loadProducts(cat, 1, false);
  }, [cat, loadProducts]);

  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const filters = [
    { key: "all", label: "All Products" },
    ...sortedCategories.map((c) => ({ key: c.slug, label: c.name })),
  ];
  const hasMore = page < totalPages;

  useEffect(() => {
    if (!filtersReady) return;
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [filtersReady, filters.length]);

  return (
    <>
      {/* Filter bar */}
      <Container className="pt-9 pb-2">
        {!filtersReady ? (
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
        ) : products.length === 0 ? (
          <div
            className="text-center py-20 text-[15px]"
            style={{ color: "#5A6480", fontFamily: "var(--font-manrope)" }}
          >
            No products found in this category.
          </div>
        ) : (
          <>
            <StaggerContainer
              staggerKey={cat}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((p) => (
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
                    <div className="p-6 pb-0">
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
                    </div>
                  </Link>
                  {/* Enquire / Price on request — sibling of the card Link, not nested inside it */}
                  <div className="px-6 pb-6 flex items-center justify-between gap-3">
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
                      href={`/contact?productId=${p.id}`}
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
                </StaggerItem>
              ))}
            </StaggerContainer>

            {hasMore && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p
                  className="text-[13.5px]"
                  style={{ color: "#9098AE", fontFamily: "var(--font-manrope)" }}
                >
                  Showing {products.length} of {total} products
                </p>
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={() => void loadProducts(cat, page + 1, true)}
                  className="inline-flex items-center gap-2 font-bold text-[15px] px-6 py-3.5 rounded-[12px] transition-colors disabled:opacity-60"
                  style={{
                    background: "#fff",
                    border: "1px solid #DFE3EE",
                    color: "#0B1226",
                    fontFamily: "var(--font-manrope)",
                    cursor: loadingMore ? "wait" : "pointer",
                  }}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading…
                    </>
                  ) : (
                    "Load more products"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
