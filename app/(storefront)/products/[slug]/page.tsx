import { StorefrontProductDetailPage } from "@/components/storefront/product-detail-page";
import { findStorefrontProductBySlug } from "@/lib/catalog/repository";
import type { Metadata } from "next";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await findStorefrontProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found | Chelsea Mart",
    };
  }

  return {
    description: product.description,
    title: `${product.title} | Chelsea Mart`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await findStorefrontProductBySlug(slug);
  return <StorefrontProductDetailPage product={product} />;
}
