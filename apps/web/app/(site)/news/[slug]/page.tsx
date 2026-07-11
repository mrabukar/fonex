import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import { stripHtml, truncate } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(iso));
}

async function getArticle(slug: string): Promise<NewsArticle | null> {
  try {
    return await apiClient.get<NewsArticle>(`/api/news/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.excerpt || truncate(stripHtml(article.body), 160),
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  return (
    <div className="pb-24">
      <Container className="pt-8 pb-2">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition-colors hover:text-[#1A1C74]"
          style={{ color: "#4C566F", fontFamily: "var(--font-manrope)" }}
        >
          <ArrowLeft size={16} />
          Back to News
        </Link>
      </Container>

      <Container as="section" className="pt-6 max-w-180">
        <FadeIn>
          {article.publishedAt && (
            <div
              className="text-[13px] font-bold mb-4"
              style={{ color: "#9098AE", fontFamily: "var(--font-jetbrains)" }}
            >
              {formatDate(article.publishedAt)}
            </div>
          )}
          <h1
            className="font-extrabold text-balance mb-8"
            style={{
              fontFamily: "var(--font-sora)",
              fontSize: "clamp(30px, 3.6vw, 42px)",
              lineHeight: 1.1,
              letterSpacing: "-.02em",
              color: "#0B1226",
            }}
          >
            {article.title}
          </h1>

          {article.imageUrl && (
            <div
              className="relative w-full mb-10 rounded-[20px] overflow-hidden"
              style={{ aspectRatio: "16/9", border: "1px solid #E7EAF3" }}
            >
              <Image src={article.imageUrl} alt="" fill sizes="720px" style={{ objectFit: "cover" }} />
            </div>
          )}

          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </FadeIn>
      </Container>
    </div>
  );
}
