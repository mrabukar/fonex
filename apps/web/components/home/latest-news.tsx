import Link from "next/link";
import Image from "next/image";
import type { PaginatedResult } from "@fonex/shared";
import { apiClient, ApiError } from "@/lib/api-client";
import { stripHtml, truncate } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(iso));
}

async function getLatestArticles(): Promise<NewsArticle[]> {
  try {
    const result = await apiClient.get<PaginatedResult<NewsArticle>>(
      "/api/news?pageSize=3",
    );
    return result.data;
  } catch (err) {
    if (err instanceof ApiError) return [];
    throw err;
  }
}

export async function LatestNews() {
  const articles = await getLatestArticles();

  if (articles.length === 0) return null;

  return (
    <Container as="section" className="pt-20 pb-8">
      <FadeIn className="flex items-end justify-between gap-6 mb-10 flex-wrap">
        <div className="max-w-[560px]">
          <div
            className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
            style={{ color: "#1A1C74" }}
          >
            Latest News
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
            What&apos;s happening at Fonex
          </h2>
        </div>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 font-bold text-[15px] px-5 py-3.5 rounded-[12px] transition-colors hover:border-[#1A1C74] hover:text-[#1A1C74] whitespace-nowrap"
          style={{
            background: "#fff",
            border: "1px solid #DFE3EE",
            color: "#0B1226",
            fontFamily: "var(--font-manrope)",
          }}
        >
          View all news →
        </Link>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <StaggerItem
            key={article.id}
            hover
            className="rounded-[20px] overflow-hidden"
            style={{
              background: "#fff",
              border: "1px solid #E7EAF3",
              boxShadow: "0 6px 18px rgba(11,18,38,.04)",
            }}
          >
            <Link href={`/news/${article.slug}`} className="block">
              <div className="relative w-full" style={{ aspectRatio: "16/9", background: "#F0F2F8" }}>
                {article.imageUrl && (
                  <Image
                    src={article.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="p-5">
                {article.publishedAt && (
                  <div
                    className="text-[12px] font-semibold mb-2"
                    style={{ color: "#9098AE", fontFamily: "var(--font-jetbrains)" }}
                  >
                    {formatDate(article.publishedAt)}
                  </div>
                )}
                <div
                  className="font-bold text-[18px] mb-2"
                  style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
                >
                  {article.title}
                </div>
                <p className="text-[14.5px] leading-[1.6]" style={{ color: "#5A6480" }}>
                  {truncate(article.excerpt || stripHtml(article.body), 120)}
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  );
}
