import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiClient, ApiError, buildQueryString } from "@/lib/api-client";
import { humanize } from "@/lib/utils";
import { colorFamilyForId } from "@/lib/content";
import type { PaginatedResult } from "@fonex/shared";
import type { Product } from "@/lib/types";
import { DeviceTile } from "@/components/graphics/device-tile";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

function statusStyle(status: Product["status"]): React.CSSProperties {
  if (status === "in_stock") return { background: "#E2F6EF", color: "#067A55" };
  if (status === "limited") return { background: "#FFF1D6", color: "#9A6400" };
  return { background: "#E7E8F5", color: "#12144F" };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    return await apiClient.get<Product>(`/api/products/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

async function getRelatedProducts(categorySlug: string, excludeId: string): Promise<Product[]> {
  try {
    const result = await apiClient.get<PaginatedResult<Product>>(
      `/api/products${buildQueryString({ category: categorySlug, pageSize: 4 })}`,
    );
    return result.data.filter((p) => p.id !== excludeId).slice(0, 3);
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(iso));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} — ${product.category.name} available at Fonex Supply Limited.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const related = await getRelatedProducts(product.category.slug, product.id);

  return (
    <div className="pb-24">
      <Container className="pt-8 pb-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition-colors hover:text-[#1A1C74]"
          style={{ color: "#4C566F", fontFamily: "var(--font-manrope)" }}
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </Container>

      <Container as="section" className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Visual */}
          <FadeIn direction="left" className="lg:sticky lg:top-28">
            <div
              className="rounded-[24px] overflow-hidden"
              style={{ border: "1px solid #E7EAF3", boxShadow: "0 16px 40px rgba(11,18,38,.08)" }}
            >
              <DeviceTile
                fam={colorFamilyForId(product.id)}
                type={product.type}
                img={product.imageUrl ?? undefined}
                size="lg"
              />
            </div>
          </FadeIn>

          {/* Details */}
          <FadeIn direction="right" delay={0.1}>
            <div className="flex items-center gap-2 mb-5">
              <span
                className="text-[12px] font-bold px-2.5 py-1.5 rounded-full"
                style={{ background: "#EEF1FB", color: "#27314B", letterSpacing: ".02em" }}
              >
                {product.category.name}
              </span>
              <span
                className="text-[12px] font-bold px-2.5 py-1.5 rounded-full"
                style={statusStyle(product.status)}
              >
                {humanize(product.status)}
              </span>
            </div>

            <h1
              className="font-extrabold text-balance mb-4"
              style={{
                fontFamily: "var(--font-sora)",
                fontSize: "clamp(30px, 3.6vw, 42px)",
                lineHeight: 1.1,
                letterSpacing: "-.02em",
                color: "#0B1226",
              }}
            >
              {product.name}
            </h1>

            <p className="text-[16px] leading-[1.7] mb-8" style={{ color: "#5A6480" }}>
              {product.description ||
                "Full details for this product are coming soon. Reach out to our team for more information."}
            </p>

            {/* Specs */}
            <div
              className="rounded-[18px] p-6 mb-8"
              style={{ background: "#F7F8FC", border: "1px solid #E7EAF3" }}
            >
              <div
                className="text-[12.5px] font-bold uppercase mb-4"
                style={{ color: "#9098AE", letterSpacing: ".06em" }}
              >
                Product Details
              </div>
              <dl className="grid grid-cols-2 gap-y-4 text-[14.5px]">
                <dt style={{ color: "#9098AE" }}>Category</dt>
                <dd className="text-right font-semibold" style={{ color: "#0B1226" }}>
                  {product.category.name}
                </dd>
                <dt style={{ color: "#9098AE" }}>Type</dt>
                <dd className="text-right font-semibold" style={{ color: "#0B1226" }}>
                  {humanize(product.type)}
                </dd>
                <dt style={{ color: "#9098AE" }}>Availability</dt>
                <dd className="text-right font-semibold" style={{ color: "#0B1226" }}>
                  {humanize(product.status)}
                </dd>
                <dt style={{ color: "#9098AE" }}>Listed</dt>
                <dd className="text-right font-semibold" style={{ color: "#0B1226" }}>
                  {formatDate(product.createdAt)}
                </dd>
              </dl>
            </div>

            {/* Enquire / Price on request */}
            <div className="flex items-center gap-3">
              <span
                className="text-[13px]"
                style={{ fontFamily: "var(--font-jetbrains)", color: "#9098AE" }}
              >
                Price on request
              </span>
              <Link
                href={`/contact?productId=${product.id}`}
                className="font-bold text-[14.5px] px-5 py-3 rounded-[11px] transition-colors hover:bg-[#1A1C74] hover:text-white"
                style={{
                  background: "#EEF1FB",
                  color: "#1A1C74",
                  fontFamily: "var(--font-manrope)",
                }}
              >
                Enquire →
              </Link>
            </div>
          </FadeIn>
        </div>
      </Container>

      {related.length > 0 && (
        <Container as="section" className="pt-20">
          <FadeIn>
            <h2
              className="font-extrabold mb-6"
              style={{ fontFamily: "var(--font-sora)", fontSize: 24, color: "#0B1226" }}
            >
              More in {product.category.name}
            </h2>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <StaggerItem
                key={r.id}
                hover
                className="rounded-[20px] overflow-hidden"
                style={{
                  background: "#fff",
                  border: "1px solid #E7EAF3",
                  boxShadow: "0 6px 18px rgba(11,18,38,.04)",
                }}
              >
                <Link href={`/products/${r.id}`} className="block">
                  <DeviceTile fam={colorFamilyForId(r.id)} type={r.type} img={r.imageUrl ?? undefined} />
                  <div className="p-5">
                    <div
                      className="font-bold text-[16px]"
                      style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
                    >
                      {r.name}
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      )}
    </div>
  );
}
