"use client"

// Adsterra Native Ad (reusable, lazy-loaded, SSR-safe)
// - Script loaded exactly once across the whole app (module-level guard)
// - Uses IntersectionObserver so the invoke script only runs when ad is near the viewport
// - Renders a fixed-height container on both server and client to eliminate layout shift

import { useEffect, useRef, useState } from "react"

// Default Adsterra native placement supplied by the site owner.
// Can be overridden per instance via props if more zones are added later.
const DEFAULT_SCRIPT_SRC =
  "https://pl29173372.profitablecpmratenetwork.com/9442a49cfd7e075a23629b2020f8e485/invoke.js"
const DEFAULT_CONTAINER_ID = "container-9442a49cfd7e075a23629b2020f8e485"

// Module-level flag so multiple <NativeAd /> instances on one page share a single script tag.
let adsterraScriptInjected = false

interface NativeAdProps {
  /** Override script URL for a different Adsterra native zone */
  scriptSrc?: string
  /** Override the target container id that the script expects */
  containerId?: string
  /** Tailwind classes applied to the wrapping <aside> */
  className?: string
  /** Reserved minimum height (prevents CLS before ad paints) */
  minHeight?: number
}

export default function NativeAd({
  scriptSrc = DEFAULT_SCRIPT_SRC,
  containerId = DEFAULT_CONTAINER_ID,
  className = "",
  minHeight = 250,
}: NativeAdProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Lazy-load: only trigger the script once the slot is close to the viewport.
  useEffect(() => {
    if (!rootRef.current) return

    // IntersectionObserver is unsupported in very old browsers — fall back to immediate load.
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
      { rootMargin: "200px" } // start loading a little before it enters the viewport
    )

    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])

  // Inject the Adsterra invoke script exactly once across the whole SPA lifetime.
  useEffect(() => {
    if (!shouldLoad) return
    if (adsterraScriptInjected) return
    if (typeof document === "undefined") return

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptSrc}"]`
    )
    if (existing) {
      adsterraScriptInjected = true
      return
    }

    const script = document.createElement("script")
    script.src = scriptSrc
    script.async = true
    script.setAttribute("data-cfasync", "false")
    document.body.appendChild(script)
    adsterraScriptInjected = true
  }, [shouldLoad, scriptSrc])

  return (
    <aside
      ref={rootRef}
      aria-label="Sponsored advertisement"
      className={`my-8 w-full ${className}`}
    >
      {/* Subtle "Sponsored" label per brand-safety / disclosure best practice */}
      <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
        <span>Sponsored</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      {/* Reserved-height container — prevents CLS even before ad paints */}
      <div
        id={containerId}
        style={{ minHeight }}
        className="w-full overflow-hidden rounded-lg bg-slate-50/50"
      />
    </aside>
  )
}
