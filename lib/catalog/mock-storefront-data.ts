export type StorefrontProduct = {
  category: string;
  description: string;
  id: string;
  imageUrl: string;
  longDescription: string;
  moq: number;
  priceDisplay: string;
  sellPriceNgn: number;
  slug: string;
  specs: string[];
  title: string;
};

export const storefrontProducts: StorefrontProduct[] = [
  {
    category: "Home Essentials",
    description: "Soft ambient lighting for apartments, studios, and gifting.",
    id: "p1",
    imageUrl: "/lamp.jpg",
    longDescription:
      "A clean-lined desk lamp selected for diaspora shoppers who want functional home pieces without sorting through noisy supplier listings.",
    moq: 1,
    priceDisplay: "NGN 20,000",
    sellPriceNgn: 20000,
    slug: "desk-lamp",
    specs: ["Warm white light", "Metal base", "Compact tabletop form"],
    title: "Desk Lamp",
  },
  {
    category: "Furniture",
    description: "Comfort-forward seating with a calmer, premium presentation.",
    id: "p2",
    imageUrl: "/chair.jpg",
    longDescription:
      "An ergonomic chair draft sourced for buyers furnishing home offices in Nigeria, with local admin-managed pricing and route-based logistics added at checkout.",
    moq: 1,
    priceDisplay: "NGN 125,000",
    sellPriceNgn: 125000,
    slug: "ergonomic-chair",
    specs: ["Adjustable height", "Lumbar support", "Fabric seat finish"],
    title: "Ergonomic Chair",
  },
  {
    category: "Kitchen",
    description: "Giftable countertop appliance with curated imagery and copy.",
    id: "p3",
    imageUrl: "/blender.jpg",
    longDescription:
      "A compact blender positioned for curated gifting and practical home use, saved into the local catalog rather than exposed as a raw supplier listing.",
    moq: 1,
    priceDisplay: "NGN 45,000",
    sellPriceNgn: 45000,
    slug: "countertop-blender",
    specs: ["Compact body", "Two-speed motor", "Easy-rinse jug"],
    title: "Countertop Blender",
  },
];

export function getStorefrontProductBySlug(slug: string) {
  return storefrontProducts.find((product) => product.slug === slug) ?? null;
}

export function getStorefrontCategories() {
  return [...new Set(storefrontProducts.map((product) => product.category))];
}
