import type {
  deviceTypeValues,
  homepageSlideStatusValues,
  newsStatusValues,
  partnerTypeValues,
  productStatusValues,
} from "@fonex/shared";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  category: Category;
  status: (typeof productStatusValues)[number];
  type: (typeof deviceTypeValues)[number];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Partner = {
  id: string;
  name: string;
  type: (typeof partnerTypeValues)[number];
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type HomepageSlideProduct = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export type HomepageSlide = {
  id: string;
  title: string;
  imageUrl: string | null;
  imageDescription: string | null;
  caption: string | null;
  bg: string;
  order: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  productId: string | null;
  product: HomepageSlideProduct | null;
  status: (typeof homepageSlideStatusValues)[number];
  createdAt: string;
  updatedAt: string;
};

export type PublicHomepageSlide = {
  id: string;
  imageUrl: string;
  imageDescription: string | null;
  caption: string | null;
  bg: string;
  productId: string | null;
};

export type HomepageSettings = {
  id: string;
  autoplayMs: number;
  updatedAt: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  imageUrl: string | null;
  status: (typeof newsStatusValues)[number];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
