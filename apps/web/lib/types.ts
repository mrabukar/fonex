import type { deviceTypeValues, productStatusValues } from "@fonex/shared";

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
