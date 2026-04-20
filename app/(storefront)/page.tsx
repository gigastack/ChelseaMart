import { StorefrontHomePage } from "@/components/storefront/home-page";
import { listStorefrontProducts } from "@/lib/catalog/repository";

export default async function StorefrontPage() {
  const products = await listStorefrontProducts();
  return <StorefrontHomePage products={products} />;
}
