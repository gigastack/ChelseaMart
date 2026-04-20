import { beforeEach, describe, expect, it, vi } from "vitest";

const createSupabaseServiceRoleClientMock = vi.fn();
const createSupabaseServerClientMock = vi.fn();
const getPublicEnvMock = vi.fn(() => ({
  siteUrl: "http://localhost:3000",
}));

vi.mock("@/lib/config/env", () => ({
  getPublicEnv: getPublicEnvMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
  createSupabaseServiceRoleClient: createSupabaseServiceRoleClientMock,
}));

function createProductsClient() {
  return {
    from(tableName: string) {
      expect(tableName).toBe("products");

      return {
        select() {
          return {
            eq() {
              return {
                order() {
                  return {
                    limit: vi.fn().mockResolvedValue({
                      data: [
                        {
                          cover_image_url: "/ProductImage.jpg",
                          id: "prod-1",
                          sell_price_ngn: 92000,
                          slug: "manual-product-image-item",
                          title: "Product Image Sample",
                          weight_kg: 1.4,
                        },
                      ],
                      error: null,
                    }),
                  };
                },
              };
            },
          };
        },
      };
    },
  };
}

function createAdminOrdersClient() {
  return {
    from(tableName: string) {
      expect(tableName).toBe("orders");

      return {
        select() {
          return {
            order: vi.fn().mockResolvedValue({
              data: [
                {
                  consignee_id: "consignee-1",
                  created_at: "2026-04-17T09:00:00.000Z",
                  grand_total_ngn: 123360,
                  id: "order-1",
                  logistics_total_ngn: 31360,
                  order_items: [
                    {
                      cover_image_url: "/ProductImage.jpg",
                      id: "item-1",
                      product_id: "prod-1",
                      product_title_snapshot: "Product Image Sample",
                      product_unit_price_ngn_snapshot: 92000,
                      quantity: 1,
                      slug: "manual-product-image-item",
                      weight_kg_snapshot: 1.4,
                    },
                  ],
                  payment_reference: "demo-paystack-ref-1001",
                  payment_status: "paid",
                  product_subtotal_ngn: 92000,
                  route: "air",
                  status: "processing",
                },
              ],
              error: null,
            }),
          };
        },
      };
    },
  };
}

function createUpdateStatusClient() {
  const eventInsert = vi.fn().mockResolvedValue({ error: null });
  const orderUpdate = vi.fn().mockResolvedValue({ error: null });

  return {
    eventInsert,
    orderUpdate,
    from(tableName: string) {
      if (tableName === "orders") {
        return {
          update() {
            return {
              eq: orderUpdate,
            };
          },
        };
      }

      expect(tableName).toBe("order_status_events");
      return {
        insert: eventInsert,
      };
    },
  };
}

describe("orders repository", () => {
  beforeEach(() => {
    vi.resetModules();
    createSupabaseServiceRoleClientMock.mockReset();
    createSupabaseServerClientMock.mockReset();
    getPublicEnvMock.mockClear();
  });

  it("maps the live checkout cart item from products", async () => {
    createSupabaseServiceRoleClientMock.mockReturnValue(createProductsClient());

    const { listCheckoutCartItems } = await import("@/lib/orders/repository");

    await expect(listCheckoutCartItems()).resolves.toEqual([
      expect.objectContaining({
        productId: "prod-1",
        title: "Product Image Sample",
        weightKg: 1.4,
      }),
    ]);
  });

  it("maps persisted admin orders", async () => {
    createSupabaseServiceRoleClientMock.mockReturnValue(createAdminOrdersClient());

    const { findAdminOrderById } = await import("@/lib/orders/repository");

    await expect(findAdminOrderById("order-1")).resolves.toMatchObject({
      id: "order-1",
      paymentStatus: "paid",
      status: "processing",
    });
  });

  it("writes the order status change and records an event", async () => {
    const client = createUpdateStatusClient();
    createSupabaseServiceRoleClientMock.mockReturnValue(client);

    const { updateOrderStatus } = await import("@/lib/orders/repository");

    await updateOrderStatus({
      note: "Admin marked the order as shipped.",
      orderId: "order-1",
      status: "shipped",
    });

    expect(client.orderUpdate).toHaveBeenCalledWith("id", "order-1");
    expect(client.eventInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        note: "Admin marked the order as shipped.",
        order_id: "order-1",
        status: "shipped",
      }),
    );
  });
});
