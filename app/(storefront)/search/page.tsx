import { StorefrontSearchPage } from "@/components/storefront/search-page";
import { listStorefrontProducts } from "@/lib/catalog/repository";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const products = await listStorefrontProducts();
  return <StorefrontSearchPage products={products} query={q} />;
}
