import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MenuDetailsPage from "../../menu/[slug]/page";
import {
  getCatalogProductBySlug,
  getCatalogProducts,
} from "@/lib/productCatalog";
import { getSiteUrl } from "@/lib/site";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getCatalogProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | FoodVely",
      description: "The requested product page is not available.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.seo?.metaTitle || `${product.name} | FoodVely`;
  const description =
    product.seo?.metaDescription ||
    product.shortDescription ||
    product.description ||
    "Read product details, pricing, and availability for FoodVely items.";

  return {
    title,
    description,
    keywords: product.seo?.keywords,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/products/${product.slug}`,
      images: product.thumbnail
        ? [product.thumbnail]
        : product.images?.slice(0, 1),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.thumbnail
        ? [product.thumbnail]
        : product.images?.slice(0, 1),
    },
  };
}

export default async function ProductsDetailPage({ params }: Props) {
  const product = await getCatalogProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/products/${product.slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    sku: String(product.id),
    image: (product.images || []).map((image) => `${siteUrl}${image}`),
    category: product.category?.title,
    brand: {
      "@type": "Brand",
      name: product.provider?.name || "FoodVely",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.currency || "BDT",
      price: String(product.discountPrice ?? product.price),
      availability: product.availability?.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating:
      product.rating?.average && product.rating.totalReviews
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating.average,
            reviewCount: product.rating.totalReviews,
          }
        : undefined,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MenuDetailsPage
        params={Promise.resolve(params)}
        catalogPath="/products"
        catalogLabel="Products"
      />
    </>
  );
}
