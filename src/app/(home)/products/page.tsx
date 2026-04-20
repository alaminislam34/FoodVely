import type { Metadata } from "next";
import MenuClient from "../menu/Components/MenuClient";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Products | FoodVely",
  description:
    "Browse the full FoodVely product catalog with filters and categories.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Products | FoodVely",
    description:
      "Browse the full FoodVely product catalog with filters and categories.",
    url: "/products",
  },
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialSlug = typeof params.slug === "string" ? params.slug : "";

  return (
    <MenuClient
      initialSlug={initialSlug}
      title="Our Products"
      description="Browse the full FoodVely product catalog with smart filters and live detail pages."
      basePath="/products"
    />
  );
}
