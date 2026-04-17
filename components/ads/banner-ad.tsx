"use client"

// Adsterra Banner Ad (reusable, CLS-safe, lazy-loaded)
// Supports three modes:
//   1. Inline banner — 728x90 on desktop, 320x50 on mobile (default)
//   2. Sidebar banner — 300x250 / 300x600
//   3. Sticky mobile bottom banner — fixed bottom, max 70px height, mobile-only
//
// Banner script is only injected once per zone, after the slot is near the viewport.
// NOTE: The site owner provided only a Native Ad script so far. When a Banner Ad zone
// is available, pass { scriptSrc, containerId } props (or set the fallback constants)
// and the component will boot it on scroll. Until then, the reserved space renders
// harmlessly so the layout stays stable.

import { useEffect, useRef, useState } from "react"

type BannerVariant = "inline" | "sidebar" | "sticky-mobile"

interface BannerAdProps {
  /** Optional Adsterra banner script URL (defaults to undefined — renders reserved space only) */
  scriptSrc?: string
  /** Optional container id the banner script expects */
  containerId?: string
  /** Placement variant — changes dimensions and behaviour */
  variant?: BannerVariant
  /** Extra Tailwind classes */
  className?: string
}

// Track which banner scripts have already been injected so duplicate instances don't re-add them.
const injectedBannerScripts = new Set<string>()

export default function BannerAd({
  scriptSrc,
  containerId,
  variant = "inline",
  className = "",
}: BannerAdProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Lazy-load via IntersectionObserver. Sticky-mobile banners are already in viewport,
  // so they load immediately.
  useEffect(() => {
    if (variant === "sticky-mobile") {
      setShouldLoad(true)
      return
    }
    if (!rootRef.current) return
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [variant])

  // Inject the banner script exactly once per zone (if one was provided).
  useEffect(() => {
    if (!shouldLoad) return
    if (!scriptSrc) return // no zone configured yet
    if (typeof document === "undefined") return
    if (injectedBannerScripts.has(scriptSrc)) return

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptSrc}"]`
    )
    if (existing) {
      injectedBannerScripts.add(scriptSrc)
      return
    }

    const script = document.createElement("script")
    script.src = scriptSrc
    script.async = true
    script.setAttribute("data-cfasync", "false")
    document.body.appendChild(script)
    injectedBannerScripts.add(scriptSrc)
  }, [shouldLoad, scriptSrc])

  // Reserved size per variant — keeps CLS at zero.
  if (variant === "sticky-mobile") {
    return (
      <div
        ref={rootRef}
        role="complementary"
        aria-label="Sponsored advertisement"
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-center border-t border-slate-200 bg-white/95 backdrop-blur px-2 py-1 md:hidden ${className}`}
        style={{ maxHeight: 70 }}
      >
        <div
          id={containerId}
          className="flex h-[50px] w-full max-w-[320px] items-center justify-center"
        />
      </div>
    )
  }

  if (variant === "sidebar") {
    return (
      <aside
        aria-label="Sponsored advertisement"
        className={`hidden lg:block ${className}`}
      >
        <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
          Sponsored
        </div>
        <div
          ref={rootRef}
          id={containerId}
          className="mx-auto w-[300px] rounded-lg bg-slate-50/50"
          style={{ minHeight: 250 }}
        />
      </aside>
    )
  }

  // Inline (default) — responsive 728x90 / 320x50
  return (
    <aside
      ref={rootRef}
      aria-label="Sponsored advertisement"
      className={`my-6 w-full ${className}`}
    >
      <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
        <span>Sponsored</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div
        id={containerId}
        className="mx-auto flex w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50/50"
        style={{
          // Reserve space to prevent CLS: 320x50 mobile minimum, 728x90 desktop via aspect.
          minHeight: 50,
          maxWidth: 728,
        }}
      >
        {/* Inner CSS-sized slot so the banner zone has a target size */}
        <div className="h-[50px] w-[320px] md:h-[90px] md:w-[728px]" />
      </div>
    </aside>
  )
}
