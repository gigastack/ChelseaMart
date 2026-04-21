export type AddToCartState = {
  message: string | null;
  status: "idle" | "error" | "success";
};

export const initialAddToCartState: AddToCartState = {
  message: null,
  status: "idle",
};
