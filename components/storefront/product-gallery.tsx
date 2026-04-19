type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : ["/placeholder.jpg"];

  return (
    <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
      <div className="hidden flex-col gap-3 lg:flex">
        {gallery.slice(0, 4).map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="aspect-square rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[linear-gradient(160deg,rgba(var(--brand-950),0.16),rgba(var(--brand-600),0.08))]"
            title={`${title} preview ${index + 1}`}
          />
        ))}
      </div>
      <div className="aspect-[4/5] rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[linear-gradient(160deg,rgba(var(--brand-950),0.96)_0%,rgba(var(--brand-600),0.24)_100%)]" />
    </div>
  );
}
