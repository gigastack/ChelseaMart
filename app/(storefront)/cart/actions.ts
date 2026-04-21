"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { AddToCartState } from "@/app/(storefront)/cart/action-state";
import {
  addSessionCartItem,
  clearSessionCart,
  readSessionCartItems,
  removeSessionCartItem,
  updateSessionCartItemQuantity,
  writeSessionCartItems,
} from "@/lib/cart/session";
import { findCheckoutCartProduct } from "@/lib/orders/repository";

function parseQuantity(value: FormDataEntryValue | null) {
  const quantity =
    typeof value === "string" && value.trim()
      ? Number(value)
      : Number.NaN;

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  return Math.floor(quantity);
}

function refreshCommercePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function addToCartAction(_: AddToCartState, formData: FormData): Promise<AddToCartState> {
  const productId = String(formData.get("productId") ?? "").trim();
  const quantity = parseQuantity(formData.get("quantity"));

  if (!productId || quantity === null) {
    return {
      message: "Choose a valid quantity before adding this item.",
      status: "error",
    };
  }

  const product = await findCheckoutCartProduct(productId);

  if (!product) {
    return {
      message: "This product is not available for purchase right now.",
      status: "error",
    };
  }

  if (quantity < product.effectiveMoq) {
    return {
      message: `Minimum order for this item is ${product.effectiveMoq}.`,
      status: "error",
    };
  }

  const cartItems = await readSessionCartItems();
  const nextCartItems = addSessionCartItem(cartItems, {
    productId,
    quantity,
  });

  await writeSessionCartItems(nextCartItems);
  refreshCommercePaths();

  return {
    message: `${product.title} added to cart.`,
    status: "success",
  };
}

export async function updateCartItemQuantityAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim();
  const quantity = parseQuantity(formData.get("quantity"));

  if (!productId || quantity === null) {
    redirect(`/cart?error=${encodeURIComponent("Choose a valid quantity before updating the cart.")}`);
  }

  const product = await findCheckoutCartProduct(productId);

  if (!product) {
    redirect(`/cart?error=${encodeURIComponent("That product is no longer available.")}`);
  }

  if (quantity < product.effectiveMoq) {
    redirect(`/cart?error=${encodeURIComponent(`Minimum order for ${product.title} is ${product.effectiveMoq}.`)}`);
  }

  const cartItems = await readSessionCartItems();
  const nextCartItems = updateSessionCartItemQuantity(cartItems, productId, quantity);
  await writeSessionCartItems(nextCartItems);
  refreshCommercePaths();

  redirect(`/cart?updated=${encodeURIComponent(product.title)}`);
}

export async function removeCartItemAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim();

  if (!productId) {
    redirect("/cart");
  }

  const cartItems = await readSessionCartItems();
  const nextCartItems = removeSessionCartItem(cartItems, productId);
  await writeSessionCartItems(nextCartItems);
  refreshCommercePaths();

  redirect("/cart?updated=removed");
}

export async function clearCartAction() {
  await clearSessionCart();
  refreshCommercePaths();
  redirect("/cart?updated=cleared");
}
