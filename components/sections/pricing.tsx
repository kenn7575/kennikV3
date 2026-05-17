"use client"

import { Check, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHead } from "@/components/ui/section-head"
import type { Package } from "@/lib/data/packages"

function PackageCard({ pkg }: { pkg: Package }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" })
  }

  return (
    <div
      className="relative flex flex-col gap-4 transition-all duration-[240ms]"
      style={{
        border: pkg.featured
          ? "1px solid var(--cobalt-500)"
          : "1px solid var(--cobalt-border)",
        borderRadius: "28px 28px 28px 28px / 32px 32px 32px 32px",
        padding: "32px 30px 28px",
        background: pkg.featured
          ? `radial-gradient(at 20% 0%, rgba(2,59,230,0.16), transparent 55%), rgba(2,59,230,0.04)`
          : "rgba(255,255,255,0.012)",
        boxShadow: pkg.featured ? "var(--glow-cobalt-soft)" : "none",
        transform: pkg.featured ? "translateY(-6px)" : "none",
      }}
    >
      {pkg.featured && (
        <span
          className="absolute"
          style={{
            top: -12,
            left: 30,
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "white",
            background: "var(--cobalt-500)",
            padding: "5px 12px",
            borderRadius: 999,
            boxShadow: "var(--glow-cobalt-soft)",
          }}
        >
          Most popular
        </span>
      )}

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--fg3)",
        }}
      >
        {pkg.name}
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
          lineHeight: 1,
          letterSpacing: "-0.035em",
          color: "var(--fg1)",
          fontWeight: 400,
        }}
      >
        {pkg.price}
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--fg3)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {pkg.duration}
      </div>

      <p
        style={{
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--fg2)",
          margin: "6px 0 0",
        }}
      >
        {pkg.blurb}
      </p>

      <ul
        className="m-0 flex list-none flex-col gap-2.5 p-0"
        style={{
          borderTop: "1px dashed var(--cobalt-border)",
          paddingTop: 18,
        }}
      >
        {pkg.includes.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5"
            style={{ fontSize: 14.5, color: "var(--fg1)", lineHeight: 1.45 }}
          >
            <Check
              size={16}
              className="mt-0.5 flex-shrink-0"
              style={{ color: "var(--cobalt-300)" }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Button
          onClick={() => scrollTo("contact")}
          className={`w-full justify-center gap-2 rounded-full ${
            pkg.featured
              ? "border-0 bg-[--cobalt-500] text-white hover:bg-[--cobalt-400]"
              : "border-[--cobalt-border-hi] bg-transparent text-[--fg1] hover:bg-white/5"
          }`}
          style={{
            padding: "13px 24px",
            fontSize: 14,
            boxShadow: pkg.featured ? "var(--glow-cobalt-soft)" : "none",
          }}
        >
          {pkg.cta}
          <ArrowUpRight size={16} />
        </Button>
      </div>
    </div>
  )
}

type PricingProps = {
  packages: Package[]
}

export function Pricing({ packages }: PricingProps) {
  return (
    <section id="pricing" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="PRICING — STRAIGHT NUMBERS"
          title={
            <>
              Three packages.{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                No &ldquo;contact for price&rdquo;.
              </em>
            </>
          }
          description="Pick the closest one to what you need — final price is fixed after a 20-minute scoping call. Nothing hidden, no day-rate surprises mid-build."
          row
        />

        <div className="grid items-stretch gap-5.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <p
          className="mt-9 text-center"
          style={{
            color: "var(--fg3)",
            fontSize: 14,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
          }}
        >
          PRICES IN DKK · INVOICED 50% UPFRONT, 50% ON SHIP · VAT/MOMS EXCLUDED
        </p>
      </div>
    </section>
  )
}
