"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { elimPlatformLabels, inferElimPlatformFromUrl, type ElimPlatform } from "@/lib/imports/elim-platform";

const platformOptions: ElimPlatform[] = ["alibaba", "taobao"];

function platformButtonClass(isActive: boolean) {
  return cn(
    "rounded-[var(--radius-md)] border px-4 py-2 text-sm font-medium transition-colors",
    isActive
      ? "border-[rgb(var(--brand-600))] bg-[rgb(var(--brand-950))] text-[rgb(var(--surface-card))]"
      : "border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-alt))]",
  );
}

export function AdminImportWorkbench() {
  const [keywordPlatform, setKeywordPlatform] = useState<ElimPlatform>("alibaba");
  const [urlInput, setUrlInput] = useState("");
  const [urlPlatformOverride, setUrlPlatformOverride] = useState<ElimPlatform | "">("");

  const detectedPlatform = useMemo(() => {
    const firstValue = urlInput
      .split(/\r?\n|,/)
      .map((value) => value.trim())
      .find(Boolean);

    if (!firstValue) {
      return null;
    }

    return inferElimPlatformFromUrl(firstValue);
  }, [urlInput]);

  const effectiveUrlPlatform = urlPlatformOverride || detectedPlatform || "";

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <article className="grid gap-5 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Keyword import</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Choose a platform before search.</h2>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-[rgb(var(--text-primary))]">Search platform</p>
          <div aria-label="Search platform" className="flex flex-wrap gap-3" role="group">
            {platformOptions.map((platform) => {
              const isActive = keywordPlatform === platform;

              return (
                <button
                  key={platform}
                  aria-pressed={isActive}
                  className={platformButtonClass(isActive)}
                  onClick={() => setKeywordPlatform(platform)}
                  type="button"
                >
                  {elimPlatformLabels[platform]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[rgb(var(--text-primary))]" htmlFor="keyword-search">
            Keyword
          </label>
          <input
            className="min-h-11 w-full rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 text-sm text-[rgb(var(--text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))]"
            defaultValue="bag"
            id="keyword-search"
            name="keyword-search"
            type="text"
          />
        </div>

        <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
          Keyword search will use {elimPlatformLabels[keywordPlatform]}. This keeps 1688 and Taobao imports explicit
          instead of silently defaulting to one marketplace.
        </p>

        <Button variant="secondary">Preview keyword import</Button>
      </article>

      <article className="grid gap-5 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">URL import</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Paste one or more source URLs.</h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[rgb(var(--text-primary))]" htmlFor="source-urls">
            Source URLs
          </label>
          <textarea
            className="min-h-40 w-full rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-3 text-sm text-[rgb(var(--text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))]"
            id="source-urls"
            name="source-urls"
            onChange={(event) => setUrlInput(event.target.value)}
            placeholder="https://detail.1688.com/offer/123456.html"
            value={urlInput}
          />
        </div>

        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_240px]">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[rgb(var(--text-primary))]">Detected platform</p>
            <p className="rounded-[var(--radius-md)] border border-dashed border-[rgba(var(--border-strong),0.72)] bg-[rgb(var(--surface-alt))] px-4 py-3 text-sm text-[rgb(var(--text-secondary))]">
              {detectedPlatform
                ? `${elimPlatformLabels[detectedPlatform]} inferred from the first URL.`
                : "No reliable platform detected yet. Paste a 1688 or Taobao URL, or choose an override."}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[rgb(var(--text-primary))]" htmlFor="platform-override">
              Manual override
            </label>
            <select
              className="min-h-11 w-full rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 text-sm text-[rgb(var(--text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))]"
              id="platform-override"
              onChange={(event) => setUrlPlatformOverride(event.target.value as ElimPlatform | "")}
              value={urlPlatformOverride}
            >
              <option value="">Use detected platform</option>
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {elimPlatformLabels[platform]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
          {effectiveUrlPlatform
            ? `URL imports will resolve using ${elimPlatformLabels[effectiveUrlPlatform as ElimPlatform]}.`
            : "If detection is uncertain, choose 1688 or Taobao before import so later availability checks keep the same source platform."}
        </p>

        <Button variant="secondary">Preview URL import</Button>
      </article>

      <article className="grid gap-5 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6 xl:col-span-2">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
          <div className="space-y-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
              Batch intake posture
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              One paste area can behave like a manifest without leaving the queue.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Operators can paste one URL, a newline-separated manifest, comma-separated values, or a spreadsheet
              column copied directly from review sheets. Detection stays explicit so every later availability scan
              inherits the same source platform.
            </p>
          </div>

          <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
              Job stages
            </p>
            <div className="grid gap-3 text-sm text-[rgb(var(--text-secondary))] md:grid-cols-4 xl:grid-cols-2">
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] px-4 py-3">Queued</div>
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] px-4 py-3">Fetching</div>
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] px-4 py-3">Deduplicating</div>
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] px-4 py-3">Draft created</div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
