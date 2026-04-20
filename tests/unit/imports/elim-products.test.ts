import { beforeEach, describe, expect, it, vi } from "vitest";

const requestElim = vi.fn();

vi.mock("@/lib/imports/elim-client", () => ({
  requestElim,
}));

describe("elim product services", () => {
  beforeEach(() => {
    requestElim.mockReset();
  });

  it("maps keyword search responses into normalized import payloads", async () => {
    requestElim.mockResolvedValue({
      data: {
        items: [
          {
            id: "701",
            images: ["https://img.example.com/product.jpg"],
            price: "18.5",
            titleEn: "Manual Sample",
            url: "https://detail.1688.com/offer/701.html",
          },
        ],
      },
    });

    const { searchElimProducts } = await import("@/lib/imports/elim-products");
    const products = await searchElimProducts("sample", "alibaba");

    expect(products).toEqual([
      {
        images: ["https://img.example.com/product.jpg"],
        platform: "alibaba",
        priceCny: 18.5,
        productId: "701",
        title: "Manual Sample",
        url: "https://detail.1688.com/offer/701.html",
      },
    ]);
    expect(requestElim).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          platform: "alibaba",
        }),
      }),
    );
  });

  it("sends taobao as the selected keyword search platform", async () => {
    requestElim.mockResolvedValue({
      data: {
        items: [
          {
            id: "taobao-1",
            image: "https://img.example.com/taobao.jpg",
            price: "28.2",
            titleEn: "Taobao Product",
            url: "https://item.taobao.com/item.htm?id=7001",
          },
        ],
      },
    });

    const { searchElimProducts } = await import("@/lib/imports/elim-products");
    const products = await searchElimProducts("dress", "taobao");

    expect(products[0]).toMatchObject({
      platform: "taobao",
      productId: "taobao-1",
      title: "Taobao Product",
    });
    expect(requestElim).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          platform: "taobao",
        }),
      }),
    );
  });

  it("resolves non-1688 urls through the unshorten flow before loading detail", async () => {
    requestElim
      .mockResolvedValueOnce({
        data: {
          id: "889",
          url: "https://detail.1688.com/offer/889.html",
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: "889",
          images: ["https://img.example.com/detail.jpg"],
          price: 22,
          titleEn: "Resolved Product",
        },
      });

    const { getElimProductByUrl } = await import("@/lib/imports/elim-products");
    const product = await getElimProductByUrl("https://e.tb.cn/sample");

    expect(product.productId).toBe("889");
    expect(product.platform).toBe("taobao");
    expect(product.title).toBe("Resolved Product");
    expect(requestElim).toHaveBeenCalledTimes(2);
    expect(requestElim).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        body: expect.objectContaining({
          platform: "taobao",
        }),
      }),
    );
  });

  it("infers alibaba from 1688 urls before loading detail", async () => {
    requestElim.mockResolvedValue({
      data: {
        id: "1688001",
        images: ["https://img.example.com/alibaba.jpg"],
        price: 14,
        titleEn: "1688 Product",
      },
    });

    const { getElimProductByUrl } = await import("@/lib/imports/elim-products");
    const product = await getElimProductByUrl("https://detail.1688.com/offer/1688001.html");

    expect(product.platform).toBe("alibaba");
    expect(requestElim).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          platform: "alibaba",
        }),
      }),
    );
  });

  it("uses a single search call for minimal connection confirmation", async () => {
    requestElim.mockResolvedValue({ data: { items: [] } });

    const { confirmElimConnection } = await import("@/lib/imports/elim-products");
    const result = await confirmElimConnection("taobao");

    expect(result).toEqual({ ok: true, platform: "taobao", sampleCount: 0 });
    expect(requestElim).toHaveBeenCalledTimes(1);
  });
});
