"use client"

import Image from "next/image"
import { SectionHead } from "@/components/ui/section-head"
import Grainient from "@/components/Grainient"

export function About() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="ABOUT — A LITTLE ABOUT ME"
          title={
            <>
              Data Technician{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                specialized <br />
                in programming.
              </em>
            </>
          }
        />

        <div
          className="grid items-start gap-16"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Photo placeholder */}
          <div
            style={{
              position: "relative",
              aspectRatio: "4/5",
              borderRadius: "28px 28px 28px 28px / 32px 32px 32px 32px",
              border: "1px solid var(--cobalt-border)",
              overflow: "hidden",
            }}
          >
            <Grainient
              warpAmplitude={30}
              warpFrequency={5}
              timeSpeed={0.3}
              color1="#FF9FFC"
              color2="#5227FF"
              color3="#023BE6"
              grainAmount={0.08}
              warpStrength={4}
              className="absolute inset-0"
            />
            <Image
              src="/me.png"
              alt="Kenni Kollemorten"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "bottom center",
                position: "absolute",
              }}
              priority
            />
          </div>

          {/* Prose */}
          <div className="flex flex-col gap-4">
            <p
              style={{
                fontSize: 21,
                lineHeight: 1.45,
                color: "var(--fg1)",
                margin: 0,
              }}
            >
              I started my education back in 2021, since then I&apos;ve shipped
              — solo or as a tiny team.
            </p>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--fg2)",
                margin: 0,
              }}
            >
              I started programming in 2019, building small websites and site
              projects.
            </p>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--fg2)",
                margin: 0,
              }}
            >
              Now I build data-driven web apps, internal tools, and APIs. I like
              to work on projects that have a positive impact, whether it&apos;s
              helping a small business grow or creating tools that make
              people&apos;s lives easier.
            </p>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--fg2)",
                margin: 0,
              }}
            >
              Outside work: free-time bartender, amateur photographer, barista,
              and a sucker for a good craft-beer.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
