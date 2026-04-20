import path from "path";
import { readFile } from "fs/promises";
import { Product } from "@/types/product";

const catalogPath = path.join(process.cwd(), "public", "FoodProducts.json");

const normalizeProducts = (raw: unknown): Product[] => {
  if (Array.isArray(raw)) return raw as Product[];
  if (raw && typeof raw === "object") {
    const data = raw as { products?: unknown[] };
    if (Array.isArray(data.products)) return data.products as Product[];
  }
  return [];
};

export const getCatalogProducts = async (): Promise<Product[]> => {
  try {
    const file = await readFile(catalogPath, "utf8");
    const parsed = JSON.parse(file) as unknown;
    return normalizeProducts(parsed);
  } catch {
    return [];
  }
};

export const getCatalogProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  const products = await getCatalogProducts();
  const match = products.find((item) => item.slug === slug);
  return match ?? null;
};
