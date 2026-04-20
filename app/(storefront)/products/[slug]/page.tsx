import { StorefrontProductDetailPage } from "@/components/storefront/product-detail-page";
import { findStorefrontProductBySlug } from "@/lib/catalog/repository";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await findStorefrontProductBySlug(slug);
  return <StorefrontProductDetailPage product={product} />;
}
