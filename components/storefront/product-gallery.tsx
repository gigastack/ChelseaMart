type ProductGalleryProps = {
  images: string[];
  title: string;
};

function buildImageBackground(imageUrl: string) {
  return {
    backgroundImage: `url("${imageUrl}")`,
  };
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : ["/ProductImage.jpg"];

  return (
    <section className="grid gap-4 xl:grid-cols-[96px_minmax(0,1fr)]">
      <div className="order-2 grid grid-cols-3 gap-3 xl:order-1 xl:grid-cols-1">
        {gallery.slice(0, 4).map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-[rgba(var(--border-strong),0.46)] bg-[rgb(var(--surface-strong))]"
            title={`${title} preview ${index + 1}`}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={buildImageBackground(image)} />
            <div className="absolute inset-0 bg-[rgba(9,19,31,0.12)]" />
          </div>
        ))}
      </div>

      <div className="order-1 overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(var(--border-strong),0.46)] bg-[rgb(var(--surface-strong))] xl:order-2">
        <div className="relative aspect-[4/5]">
          <div className="absolute inset-0 bg-cover bg-center" style={buildImageBackground(gallery[0])} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(9, 19, 31, 0.08) 0%, rgba(9, 19, 31, 0.02) 24%, rgba(9, 19, 31, 0.58) 100%)",
            }}
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-5">
            <span className="rounded-full border border-white/18 bg-[rgba(255,255,255,0.14)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur">
              Local catalog image
            </span>
            <span className="rounded-full border border-white/18 bg-[rgba(9,19,31,0.42)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur">
              Proof-first logistics
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 grid gap-2 p-5 text-white">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">Product view</p>
            <h2 className="max-w-xl text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
            <p className="max-w-lg text-sm leading-6 text-white/80">
              Browse the product in CNY, lock the route before product payment, and keep shipping outside the first
              charge until warehouse proof exists.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
