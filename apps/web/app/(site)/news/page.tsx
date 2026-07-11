import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import type { PaginatedResult } from "@fonex/shared";
import { apiClient, ApiError } from "@/lib/api-client";
import { stripHtml, truncate } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

export const metadata: Metadata = {
  title: "News",
  description: "The latest news and updates from Fonex Supply Limited.",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(iso));
}

async function getArticles(): Promise<NewsArticle[]> {
  try {
    const result = await apiClient.get<PaginatedResult<NewsArticle>>(
      "/api/news?pageSize=24",
    );
    return result.data;
  } catch (err) {
    if (err instanceof ApiError) return [];
    throw err;
  }
}

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <div>
      {/* ===== HEADER ===== */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E7EAF3" }}>
        <Container className="pt-14 pb-10">
          <FadeIn delay={0}>
            <div
              className="text-[13px] font-bold tracking-[.08em] uppercase mb-3.5"
              style={{ color: "#1A1C74" }}
            >
              News &amp; Updates
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1
              className="font-extrabold text-balance max-w-180"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: "clamp(36px, 4vw, 48px)",
                lineHeight: 1.08,
                letterSpacing: "-.03em",
                color: "#0B1226",
              }}
            >
              What&apos;s happening at Fonex
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p
              className="text-[17.5px] leading-[1.6] max-w-150 mt-4"
              style={{ color: "#4C566F" }}
            >
              Announcements, partnerships, and updates from across our business.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ===== ARTICLES GRID ===== */}
      <Container as="section" className="py-16">
        {articles.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 rounded-[20px] py-24 text-center"
            style={{ background: "#F7F8FC", border: "1px solid #E7EAF3" }}
          >
            <Newspaper size={32} style={{ color: "#9098AE" }} />
            <p className="font-semibold" style={{ color: "#0B1226" }}>
              No news yet
            </p>
            <p className="text-[14px]" style={{ color: "#9098AE" }}>
              Check back soon for updates.
            </p>
          </div>
        ) : (
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
                      {truncate(article.excerpt || stripHtml(article.body), 140)}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </div>
  );
}
