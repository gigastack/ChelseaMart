import { StorefrontCatalogPage } from "@/components/storefront/catalog-page";
import { listStorefrontCategories, listStorefrontProducts } from "@/lib/catalog/repository";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([listStorefrontCategories(), listStorefrontProducts()]);
  return <StorefrontCatalogPage categories={categories} products={products} />;
}
