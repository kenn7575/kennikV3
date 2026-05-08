"use client"

import { ArrowUpRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { PrismBackground } from "@/components/ui/prism-background"
import { RevealText } from "@/components/ui/reveal-text"
import { Scramble } from "@/components/ui/scramble"
import { ScrollCue } from "@/components/ui/scroll-cue"
import Prism from "../ui/prism"

export function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" })
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        padding: "clamp(96px, 14vw, 200px) 0 clamp(80px, 12vw, 140px)",
        minHeight: "min(96vh, 1100px)",
        background: "var(--ink-950)",
      }}
    >
      <div className="absolute top-0 left-0 h-[800px] w-full">
        <div style={{ width: "100%", height: "800px", position: "relative" }}>
          <Prism
            animationType="3drotate"
            timeScale={0.3}
            height={3.5}
            baseWidth={5}
            scale={3.6}
            hueShift={0.0584}
            colorFrequency={0.45}
            noise={0.1}
            glow={0.6}
          />
          <div
            id="urmom"
            className="relative bottom-40 z-20 h-40 w-full bg-linear-to-t from-background to-transparent"
          ></div>
        </div>
      </div>
      <div className="hero-grain" />
      <div className="hero-fade-bottom" />

      <div className="shell relative z-[21]">
        <div className="mb-7">
          <Eyebrow>FULL-STACK · FREELANCE · SVENDBORG + REMOTE</Eyebrow>
        </div>

        <h1
          className="m-0"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 9.5vw, 9rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
            fontWeight: 400,
            color: "var(--fg1)",
            textWrap: "balance",
            textShadow:
              "0 2px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          <RevealText text="I build full-stack things" />
          <br />
          <RevealText start={250} text="that are cheap" />{" "}
          <span style={{ fontStyle: "italic", color: "var(--cobalt-300)" }}>
            and efficient.
          </span>
        </h1>

        <p
          className="mt-7 max-w-[580px]"
          style={{
            fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
            lineHeight: 1.55,
            color: "var(--fg2)",
          }}
        >
          Hi — I&apos;m Kenni. I&apos;m a freelance developer specialized in app
          and web development. I help startups and businesses build and maintain
          important software solutions, that help them grow and succeed. I have
          over 5 years of experience shipping software, and I&apos;m based in
          Svendborg, Denmark.{" "}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3.5">
          <Button
            onClick={() => scrollTo("contact")}
            className="gap-2 rounded-full border-0 bg-[--cobalt-500] text-white hover:bg-[--cobalt-400]"
            style={{
              padding: "13px 24px",
              fontSize: 14,
              boxShadow: "var(--glow-cobalt-soft)",
            }}
          >
            Start a project
            <ArrowUpRight size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => scrollTo("work")}
            className="gap-2 rounded-full border-[--cobalt-border-hi] bg-transparent text-[--fg1] hover:bg-white/5"
            style={{ padding: "13px 24px", fontSize: 14 }}
          >
            See selected work
            <ArrowRight size={16} />
          </Button>
        </div>

        <div
          className="mt-16 flex flex-wrap items-baseline gap-x-9 gap-y-4"
          style={{
            borderTop: "1px solid var(--cobalt-border)",
            paddingTop: 28,
          }}
        >
          {[
            {
              v: "87",
              suffix: "",
              em: "repos",
              label: "Total on github",
            },
            {
              v: "6",
              suffix: "+",
              em: "live solutions",
              label: "P99 LATENCY · HALFTRACK",
            },
            { v: "100", suffix: "%", em: "", label: "UPTIME · 12 MONTHS" },
            {
              v: "Quality",
              suffix: " ",
              em: "",
              label: "I only ship code I'm proud of",
            },
          ].map(({ v, suffix, em, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  letterSpacing: "-0.03em",
                  color: "var(--fg1)",
                  lineHeight: 1,
                }}
              >
                <Scramble value={v} />
                {suffix}
                {em && (
                  <em style={{ fontStyle: "italic", color: "var(--fg3)" }}>
                    {" "}
                    {em}
                  </em>
                )}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--fg3)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ScrollCue />
    </section>
  )
}
