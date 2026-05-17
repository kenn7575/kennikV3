import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Tag } from "@/components/ui/tag"
import { CodeBlock } from "@/components/ui/code-block"
import { PDBar } from "@/components/sections/project-bar"
import type {
  Project,
  ProjectSection,
  CoverImage,
  ProseSection,
  SplitSection,
  CalloutSection,
  CodeSection,
  GallerySection,
  WideImageSection,
  AsideImageSection,
  QuoteSection,
  StatsSection,
} from "@/lib/data/projects"
import { prisma } from "@/lib/prisma"

/* ------------------------------------------------------------------ */
/*  Inline markup: *italic accent* **bold**                             */
/* ------------------------------------------------------------------ */

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>)
    else if (m[3])
      parts.push(
        <em
          key={key++}
          className="accent"
          style={{ color: "var(--cobalt-300)", fontStyle: "italic" }}
        >
          {m[3]}
        </em>
      )
    last = re.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 ? parts[0] : parts
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                               */
/* ------------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  heading,
  italic,
}: {
  eyebrow?: string
  heading?: string
  italic?: string
}) {
  return (
    <>
      {eyebrow && <Eyebrow className="mb-4.5">{eyebrow}</Eyebrow>}
      {heading && (
        <h2
          className="m-0 max-w-[22ch] font-display text-[clamp(2rem,4vw,3.2rem)] leading-none font-normal tracking-[-0.035em] text-balance text-(--fg1) [&_.accent]:text-(--cobalt-300) [&_.accent]:italic [&_em]:text-(--fg2) [&_em]:italic"
          style={eyebrow ? { marginTop: 14 } : undefined}
        >
          {renderInline(heading)}
          {italic && (
            <>
              {" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                {italic}
              </em>
            </>
          )}
        </h2>
      )}
    </>
  )
}

function BodyText({ body }: { body: string | string[] }) {
  const paragraphs = Array.isArray(body) ? body : [body]
  return (
    <div className="[&_em]:text-(--fg1) [&_em]:italic [&_p]:mb-[1.2em] [&_p]:max-w-[64ch] [&_p]:text-[17.5px] [&_p]:leading-[1.7] [&_p]:text-pretty [&_p]:text-(--fg2) [&_p:last-child]:mb-0">
      {paragraphs.map((p, i) => (
        <p key={i}>{renderInline(p)}</p>
      ))}
    </div>
  )
}

function CoverImg({
  image,
  className,
  aspectClass = "aspect-[4/3]",
  monoSize = "text-[clamp(2.5rem,6vw,5rem)]",
}: {
  image: CoverImage
  className?: string
  aspectClass?: string
  monoSize?: string
}) {
  return (
    <div
      className={
        className ??
        `relative ${aspectClass} overflow-hidden rounded-[18px] border border-(--cobalt-border) transition-[transform,border-color] duration-240 hover:-translate-y-0.5 hover:border-(--cobalt-border-hi)`
      }
    >
      <div className="absolute inset-0" style={{ background: image.cover }} />
      <div className="absolute inset-0 bg-(image:--grain-url) opacity-35 mix-blend-overlay" />
      <div
        className={`absolute inset-0 flex items-center justify-center font-display italic ${monoSize} tracking-[-0.04em] text-white/92`}
      >
        {image.mono}
      </div>
      {image.label && (
        <span className="absolute bottom-3 left-3.5 rounded-full border border-white/12 bg-black/40 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.14em] text-white/85 uppercase backdrop-blur-[6px]">
          {image.label}
        </span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  HERO                                                                */
/* ------------------------------------------------------------------ */

export function PDHero({ project }: { project: Project }) {
  const h = project.hero!
  return (
    <section className="relative isolate overflow-hidden pt-[clamp(80px,12vw,160px)] pb-[clamp(48px,8vw,96px)]">
      <div
        className="absolute inset-[-10%] z-0 opacity-60"
        style={{ background: "var(--mesh-soft)" }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-(image:--grain-url) opacity-45 mix-blend-overlay" />

      <div className="shell relative z-1">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-3.5 font-mono text-[12px] tracking-[0.14em] text-(--fg3) uppercase">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-(--fg2) transition-colors duration-140 hover:text-(--cobalt-300)"
          >
            <ArrowLeft size={12} /> Kennik.dk
          </Link>
          <span className="text-(--fg-mute)">/</span>
          <span>Work</span>
          <span className="text-(--fg-mute)">/</span>
          <span className="text-(--fg1)">{project.name}</span>
        </div>

        <Eyebrow>{h.eyebrow}</Eyebrow>

        <h1 className="mt-4.5 mb-7 max-w-[22ch] font-display text-[clamp(2.5rem,7vw,6.4rem)] leading-[0.95] font-normal tracking-[-0.04em] text-balance text-(--fg1) [&_.accent]:text-(--cobalt-300) [&_.accent]:italic [&_em]:text-(--fg2) [&_em]:italic">
          {renderInline(h.headline)}
        </h1>

        <p className="mb-10 max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.3rem)] leading-[1.55] text-(--fg2)">
          {h.summary}
        </p>

        {/* Meta tags */}
        <div className="mb-14 flex flex-wrap gap-2.5">
          {project.role && (
            <Tag>
              <strong
                style={{
                  color: "var(--fg1)",
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                ROLE
              </strong>
              &nbsp;&nbsp;{project.role}
            </Tag>
          )}
          {project.client && (
            <Tag>
              <strong
                style={{
                  color: "var(--fg1)",
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                CLIENT
              </strong>
              &nbsp;&nbsp;{project.client}
            </Tag>
          )}
          {project.url && (
            <Tag>
              <strong
                style={{
                  color: "var(--fg1)",
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                URL
              </strong>
              &nbsp;&nbsp;{project.url}
            </Tag>
          )}
          {project.stack.slice(0, 4).map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>

        {/* Metrics ribbon */}
        <div className="grid grid-cols-4 border-t border-b border-(--cobalt-border) bg-white/[0.012] max-[760px]:grid-cols-2">
          {h.metrics.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col border-r border-(--cobalt-border-lo) p-[26px_24px] last:border-r-0 gap-1.5${m.emph ? "[&_.v]:text-(--cobalt-300) [&_.v]:italic" : ""}`}
            >
              <span className="v font-display text-[clamp(2rem,3vw,2.6rem)] leading-none tracking-[-0.035em] text-(--fg1)">
                {m.v}
              </span>
              <span className="l font-mono text-[11px] tracking-[0.14em] text-(--fg3) uppercase">
                {m.l}
              </span>
            </div>
          ))}
        </div>

        {/* Cover */}
        <div className="relative mt-16 aspect-video overflow-hidden rounded-[32px] border border-(--cobalt-border-hi) [box-shadow:0_40px_80px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0" style={{ background: h.cover }} />
          <div className="absolute inset-0 bg-(image:--grain-url) opacity-35 mix-blend-overlay" />
          <div className="absolute inset-0 flex items-center justify-center font-display text-[clamp(5rem,14vw,13rem)] tracking-tighter text-white/94 italic [text-shadow:0_4px_32px_rgba(0,0,0,0.5)]">
            {project.monogram}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  SECTION KINDS                                                       */
/* ------------------------------------------------------------------ */

function SecProse({ s }: { s: ProseSection }) {
  return (
    <section className="relative border-t border-(--cobalt-border-lo) py-[clamp(56px,8vw,112px)]">
      <div className="shell grid grid-cols-[4fr_7fr] gap-16 max-[880px]:grid-cols-1 max-[880px]:gap-6">
        <div>
          <SectionHeading
            eyebrow={s.eyebrow}
            heading={s.heading}
            italic={s.italic}
          />
        </div>
        <BodyText body={s.body} />
      </div>
    </section>
  )
}

function SecSplit({ s }: { s: SplitSection }) {
  return (
    <section className="relative border-t border-(--cobalt-border-lo) py-[clamp(56px,8vw,112px)]">
      <div className="shell grid grid-cols-[5fr_7fr] items-start gap-16 max-[880px]:grid-cols-1 max-[880px]:gap-7">
        <div>
          <SectionHeading
            eyebrow={s.eyebrow}
            heading={s.heading}
            italic={s.italic}
          />
        </div>
        <div>
          <BodyText body={s.body} />
          {s.meta && (
            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-(--cobalt-border) bg-(--cobalt-border)">
              {s.meta.map((m, i) => (
                <div key={i} className="bg-(--ink-950) p-[20px_22px]">
                  <div className="mb-1.5 font-mono text-[11px] tracking-[0.14em] text-(--fg3) uppercase">
                    {m.l}
                  </div>
                  <div className="text-[15.5px] leading-[1.4] text-(--fg1)">
                    {m.v}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function SecCallout({ s }: { s: CalloutSection }) {
  return (
    <section
      className="relative border-y border-[rgba(2,59,230,0.3)] py-[clamp(56px,8vw,112px)]"
      style={{
        background:
          "radial-gradient(at 0% 50%, rgba(2,59,230,0.16), transparent 50%), rgba(2,59,230,0.04)",
      }}
    >
      <div className="shell grid grid-cols-[minmax(160px,1fr)_8fr] items-start gap-12 max-[760px]:grid-cols-1 max-[760px]:gap-4">
        <div className="relative pt-3 pl-6 font-mono text-[12px] tracking-[0.18em] text-(--cobalt-300) uppercase before:absolute before:top-4.5 before:left-0 before:h-px before:w-3 before:bg-(--cobalt-300) before:content-['']">
          {s.label ?? "NOTE"}
        </div>
        <div>
          <SectionHeading heading={s.heading} italic={s.italic} />
          <div className="mt-5 [&_p]:max-w-[68ch] [&_p]:text-[19px] [&_p]:text-(--fg1)">
            <BodyText body={s.body} />
          </div>
        </div>
      </div>
    </section>
  )
}

async function SecCode({ s }: { s: CodeSection }) {
  return (
    <section className="relative border-t border-(--cobalt-border-lo) py-[clamp(56px,8vw,112px)]">
      <div className="shell flex flex-col gap-9">
        <div className="grid grid-cols-[5fr_7fr] gap-16 max-[880px]:grid-cols-1 max-[880px]:gap-4">
          <div>
            <SectionHeading
              eyebrow={s.eyebrow}
              heading={s.heading}
              italic={s.italic}
            />
          </div>
          {s.body && <BodyText body={s.body} />}
        </div>
        <CodeBlock code={s.code} language={s.language} caption={s.caption} />
      </div>
    </section>
  )
}

function SecGallery({ s }: { s: GallerySection }) {
  const cols =
    s.images.length <= 2
      ? "grid-cols-2 max-[760px]:grid-cols-1"
      : "grid-cols-3 max-[880px]:grid-cols-2 max-[540px]:grid-cols-1"
  return (
    <section className="relative border-t border-(--cobalt-border-lo) py-[clamp(56px,8vw,112px)]">
      <div className="shell flex flex-col gap-10">
        <div className="grid grid-cols-[5fr_7fr] gap-16 max-[880px]:grid-cols-1 max-[880px]:gap-4">
          <div>
            <SectionHeading
              eyebrow={s.eyebrow}
              heading={s.heading}
              italic={s.italic}
            />
          </div>
          {s.body && <BodyText body={s.body} />}
        </div>
        <div className={`grid ${cols} gap-4.5`}>
          {s.images.map((img, i) => (
            <CoverImg key={i} image={img} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SecWideImage({ s }: { s: WideImageSection }) {
  const ar = s.image.aspect
    ? ({ "--ar": s.image.aspect } as React.CSSProperties)
    : undefined
  return (
    <section className="relative border-t border-(--cobalt-border-lo) py-[clamp(56px,8vw,112px)]">
      <div className="shell flex flex-col gap-10">
        <div className="grid grid-cols-[5fr_7fr] items-end gap-16 max-[880px]:grid-cols-1 max-[880px]:gap-4">
          <div>
            <SectionHeading
              eyebrow={s.eyebrow}
              heading={s.heading}
              italic={s.italic}
            />
          </div>
          {s.body && <BodyText body={s.body} />}
        </div>
        <div
          className="relative overflow-hidden rounded-[24px] border border-(--cobalt-border-hi) [box-shadow:0_32px_64px_-16px_rgba(0,0,0,0.5)]"
          style={{ aspectRatio: "var(--ar, 16/9)", ...ar }}
        >
          <div
            className="absolute inset-0"
            style={{ background: s.image.cover }}
          />
          <div className="absolute inset-0 bg-(image:--grain-url) opacity-35 mix-blend-overlay" />
          <div className="absolute inset-0 flex items-center justify-center font-display text-[clamp(5rem,12vw,10rem)] tracking-tighter text-white/95 italic">
            {s.image.mono}
          </div>
          {s.image.label && (
            <span className="absolute bottom-3 left-3.5 rounded-full border border-white/12 bg-black/40 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.14em] text-white/85 uppercase backdrop-blur-[6px]">
              {s.image.label}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

function SecAsideImage({ s }: { s: AsideImageSection }) {
  const isLeft = s.imageSide === "left"
  return (
    <section className="relative border-t border-(--cobalt-border-lo) py-[clamp(56px,8vw,112px)]">
      <div
        className={`shell grid items-center gap-14 max-[880px]:grid-cols-1 max-[880px]:gap-7 ${isLeft ? "grid-cols-[5fr_6fr]" : "grid-cols-[6fr_5fr]"}`}
      >
        <div className={isLeft ? "order-1" : ""}>
          <SectionHeading
            eyebrow={s.eyebrow}
            heading={s.heading}
            italic={s.italic}
          />
          <div className="mt-5">
            <BodyText body={s.body} />
          </div>
        </div>
        <CoverImg
          image={s.image}
          className={`relative aspect-4/5 overflow-hidden rounded-[24px] border border-(--cobalt-border-hi) [box-shadow:0_32px_64px_-16px_rgba(0,0,0,0.5)]${isLeft ? "order-0 max-[880px]:order-1" : ""}`}
          aspectClass="aspect-4/5"
          monoSize="text-[clamp(4rem,10vw,8rem)]"
        />
      </div>
    </section>
  )
}

function SecQuote({ s }: { s: QuoteSection }) {
  return (
    <section
      className="border-t border-(--cobalt-border-lo) py-[clamp(80px,12vw,140px)] text-center"
      style={{
        background:
          "radial-gradient(at 50% 50%, rgba(2,59,230,0.1), transparent 60%)",
      }}
    >
      <div className="shell">
        <span className="mx-auto mb-3 block h-10 font-display text-[120px] leading-[0.4] text-(--cobalt-500) italic">
          &ldquo;
        </span>
        <blockquote className="mx-auto max-w-[22ch] font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.2] tracking-tight text-balance text-(--fg1) italic [&_.accent]:text-(--cobalt-300) [&_.accent]:not-italic [&_em]:text-(--cobalt-300) [&_em]:not-italic">
          {renderInline(s.body)}
        </blockquote>
        <div className="mt-7 font-mono text-[12px] tracking-[0.18em] text-(--fg3) uppercase">
          — {s.who}
        </div>
      </div>
    </section>
  )
}

function SecStats({ s }: { s: StatsSection }) {
  return (
    <section className="relative border-t border-(--cobalt-border-lo) py-[clamp(56px,8vw,112px)]">
      <div className="shell flex flex-col gap-12">
        <div className="max-w-[60ch]">
          <SectionHeading
            eyebrow={s.eyebrow}
            heading={s.heading}
            italic={s.italic}
          />
          {s.body && <BodyText body={s.body} />}
        </div>
        <div className="grid grid-cols-4 border-t border-b border-(--cobalt-border) bg-white/[0.012] max-[760px]:grid-cols-2">
          {s.stats.map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col border-r border-(--cobalt-border-lo) p-[28px_24px] last:border-r-0 gap-1.5${stat.emph ? "[&_.v]:text-(--cobalt-300) [&_.v]:italic" : ""}`}
            >
              <span className="v font-display text-[clamp(2.2rem,3.5vw,3rem)] leading-none tracking-[-0.04em] text-(--fg1)">
                {stat.value}
              </span>
              <span className="l font-mono text-[11px] tracking-[0.14em] text-(--fg3) uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section dispatcher                                                  */
/* ------------------------------------------------------------------ */

async function PDSection({ s }: { s: ProjectSection }) {
  switch (s.kind) {
    case "prose":
      return <SecProse s={s} />
    case "split":
      return <SecSplit s={s} />
    case "callout":
      return <SecCallout s={s} />
    case "code":
      return await SecCode({ s })
    case "gallery":
      return <SecGallery s={s} />
    case "wide-image":
      return <SecWideImage s={s} />
    case "aside-image":
      return <SecAsideImage s={s} />
    case "quote":
      return <SecQuote s={s} />
    case "stats":
      return <SecStats s={s} />
    default:
      return null
  }
}

/* ------------------------------------------------------------------ */
/*  RELATED PROJECTS                                                    */
/* ------------------------------------------------------------------ */

function PDRelated({ related }: { related: NonNullable<Project["related"]> }) {
  if (!related.length) return null
  return (
    <section className="border-t border-(--cobalt-border) bg-(--ink-950) py-[clamp(64px,10vw,128px)]">
      <div className="shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>NEXT UP — MORE WORK</Eyebrow>
            <h3 className="mt-2 mb-0 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-normal tracking-[-0.03em] text-(--fg1)">
              Other things{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                I&apos;ve shipped.
              </em>
            </h3>
          </div>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full border border-(--cobalt-border) bg-transparent px-5 py-3.25 text-[14px] font-normal text-(--fg2) no-underline transition-[border-color,color] duration-140 hover:border-(--cobalt-border-hi) hover:text-(--fg1)"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4.5 max-[760px]:grid-cols-1">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="relative grid grid-cols-[220px_1fr] overflow-hidden rounded-[24px] border border-(--cobalt-border) bg-(--ink-900) no-underline transition-[border-color,transform] duration-240 hover:-translate-y-0.5 hover:border-(--cobalt-border-hi) max-[540px]:grid-cols-1"
            >
              <div className="relative aspect-square border-r border-(--cobalt-border-lo) max-[540px]:aspect-video max-[540px]:border-r-0 max-[540px]:border-b">
                <div
                  className="absolute inset-0"
                  style={{ background: p.cover }}
                />
                <div className="absolute inset-0 bg-(image:--grain-url) opacity-35 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center font-display text-[3rem] tracking-[-0.04em] text-white/92 italic">
                  {p.monogram}
                </div>
              </div>
              <div className="flex flex-col justify-between gap-3 p-[22px_22px_20px]">
                <h4 className="m-0 font-display text-[24px] leading-none font-normal tracking-tight text-(--fg1)">
                  {p.name}{" "}
                  <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                    — {p.italic}
                  </em>
                </h4>
                <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-(--cobalt-300) uppercase">
                  View case <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                 */
/* ------------------------------------------------------------------ */

async function PDCTA() {
  const slots = await prisma.availabilitySlot.findMany({
    orderBy: { order: "asc" },
  })
  const openSlots = slots.filter((s) => s.open)
  const count = openSlots.length
  const periodLabel = openSlots
    .map((s) => `${s.startDate} — ${s.endDate}`)
    .join(", ")

  const availabilityText =
    count === 0
      ? "No open slots right now — but reach out and I'll add you to the waitlist."
      : `I have ${count === 1 ? "one slot" : `${count} slots`} open${periodLabel ? ` ${periodLabel}` : ""}. Claim a spot before they fill up.`

  return (
    <section className="relative overflow-hidden border-t border-(--cobalt-border) py-[clamp(80px,12vw,140px)] text-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(at 50% 0%, rgba(2,59,230,0.25), transparent 50%), radial-gradient(at 20% 100%, rgba(178,102,255,0.16), transparent 55%), radial-gradient(at 80% 100%, rgba(93,226,255,0.12), transparent 55%)",
        }}
      />
      <div className="shell relative z-1">
        <Eyebrow>LIKE WHAT YOU SEE</Eyebrow>
        <h2 className="mx-auto mt-3 mb-6 max-w-[22ch] font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] font-normal tracking-[-0.035em] text-balance text-(--fg1)">
          Got something{" "}
          <em style={{ fontStyle: "italic", color: "var(--cobalt-300)" }}>
            like this
          </em>{" "}
          on your plate?
        </h2>
        <p className="mx-auto mb-9 max-w-[50ch] text-[17px] leading-[1.6] text-(--fg2)">
          {availabilityText}
        </p>
        <div className="inline-flex flex-wrap justify-center gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border border-(--cobalt-400) bg-(--cobalt-500) px-5.5 py-3.25 font-sans text-[14px] font-medium text-white no-underline transition-[background,box-shadow] duration-140 hover:bg-(--cobalt-400) hover:text-white hover:[box-shadow:var(--glow-cobalt-soft)]"
          >
            <span>Start a project</span> <ArrowUpRight size={16} />
          </Link>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full border border-(--cobalt-border) bg-transparent px-5 py-3.25 font-sans text-[14px] font-normal text-(--fg2) no-underline transition-[border-color,color] duration-140 hover:border-(--cobalt-border-hi) hover:text-(--fg1)"
          >
            <span>See all work</span> <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE ROOT                                                           */
/* ------------------------------------------------------------------ */

export async function ProjectDetailPage({ project }: { project: Project }) {
  return (
    <>
      <PDBar project={project} />
      <PDHero project={project} />
      {project.sections?.map((s, i) => (
        <PDSection key={i} s={s} />
      ))}
      {project.related && project.related.length > 0 && (
        <PDRelated related={project.related} />
      )}
      <PDCTA />
    </>
  )
}
