import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import type { Project } from "@/lib/data/projects"

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const project: Project = await req.json()

  const html = buildPreviewHtml(project)
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function bg(cover: string): string {
  return cover.startsWith("http") ? `url(${esc(cover)}) center/cover no-repeat` : esc(cover)
}

function renderInlineMarkup(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, `<em style="color:var(--cobalt-300);font-style:italic">$1</em>`)
}

function coverBlock(cover: string, mono: string, aspect = "16/9", radius = "24px"): string {
  return `<div style="position:relative;aspect-ratio:${aspect};border-radius:${radius};border:1px solid var(--cobalt-border);overflow:hidden;box-shadow:0 32px 64px -16px rgba(0,0,0,.5)">
  <div style="position:absolute;inset:0;background:${bg(cover)}"></div>
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-style:italic;font-size:clamp(5rem,12vw,10rem);color:rgba(255,255,255,.94);letter-spacing:-.04em;text-shadow:0 4px 32px rgba(0,0,0,.5)">${esc(mono)}</div>
</div>`
}

function bodyText(body: string | string[]): string {
  const paras = Array.isArray(body) ? body : [body]
  return paras.map(p => `<p style="font-size:17.5px;line-height:1.7;color:var(--fg2);margin:0 0 1.2em;max-width:64ch">${renderInlineMarkup(esc(p))}</p>`).join("")
}

function sectionHeading(eyebrow?: string, heading?: string, italic?: string): string {
  let html = ""
  if (eyebrow) html += `<span style="display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin-bottom:16px"><span style="display:inline-block;width:32px;height:1px;background:var(--fg3)"></span>${esc(eyebrow)}</span>`
  if (heading) html += `<h2 style="font-family:var(--font-display);font-size:clamp(2rem,4vw,3.2rem);line-height:1;letter-spacing:-.035em;font-weight:400;color:var(--fg1);margin:${eyebrow ? "14px" : "0"} 0 0;max-width:22ch">${renderInlineMarkup(esc(heading))}${italic ? ` <em style="font-style:italic;color:var(--fg2)">${esc(italic)}</em>` : ""}</h2>`
  return html
}

function secProse(s: { eyebrow?: string; heading?: string; italic?: string; body: string | string[] }): string {
  return `<section style="padding:clamp(56px,8vw,112px) 0;border-top:1px solid var(--cobalt-border-lo)">
  <div class="shell" style="display:grid;grid-template-columns:4fr 7fr;gap:64px">
    <div>${sectionHeading(s.eyebrow, s.heading, s.italic)}</div>
    <div>${bodyText(s.body)}</div>
  </div>
</section>`
}

function secSplit(s: { eyebrow?: string; heading?: string; italic?: string; body: string | string[]; meta?: { l: string; v: string }[] }): string {
  const metaHtml = s.meta ? `<div style="margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--cobalt-border);border:1px solid var(--cobalt-border);border-radius:20px;overflow:hidden">${s.meta.map(m => `<div style="background:var(--ink-950);padding:20px 22px"><div style="font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin-bottom:6px">${esc(m.l)}</div><div style="font-size:15.5px;color:var(--fg1);line-height:1.4">${esc(m.v)}</div></div>`).join("")}</div>` : ""
  return `<section style="padding:clamp(56px,8vw,112px) 0;border-top:1px solid var(--cobalt-border-lo)">
  <div class="shell" style="display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start">
    <div>${sectionHeading(s.eyebrow, s.heading, s.italic)}</div>
    <div>${bodyText(s.body)}${metaHtml}</div>
  </div>
</section>`
}

function secCallout(s: { label?: string; heading?: string; italic?: string; body: string }): string {
  return `<section style="padding:clamp(56px,8vw,112px) 0;border-top:1px solid rgba(2,59,230,.3);border-bottom:1px solid rgba(2,59,230,.3);background:radial-gradient(at 0% 50%,rgba(2,59,230,.16),transparent 50%),rgba(2,59,230,.04)">
  <div class="shell" style="display:grid;grid-template-columns:minmax(160px,1fr) 8fr;gap:48px;align-items:start">
    <div style="font-family:var(--font-mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--cobalt-300);padding-top:12px;padding-left:24px;position:relative"><span style="position:absolute;left:0;top:18px;width:12px;height:1px;background:var(--cobalt-300)"></span>${esc(s.label ?? "NOTE")}</div>
    <div>${sectionHeading(undefined, s.heading, s.italic)}<div style="margin-top:20px;font-size:19px">${bodyText(s.body)}</div></div>
  </div>
</section>`
}

function secCode(s: { eyebrow?: string; heading?: string; italic?: string; body?: string; language: string; code: string; caption?: string }): string {
  return `<section style="padding:clamp(56px,8vw,112px) 0;border-top:1px solid var(--cobalt-border-lo)">
  <div class="shell" style="display:flex;flex-direction:column;gap:36px">
    <div style="display:grid;grid-template-columns:5fr 7fr;gap:64px">
      <div>${sectionHeading(s.eyebrow, s.heading, s.italic)}</div>
      ${s.body ? `<div>${bodyText(s.body)}</div>` : "<div></div>"}
    </div>
    <div style="border-radius:20px;border:1px solid var(--cobalt-border);overflow:hidden;background:#0d0f17">
      <div style="padding:10px 16px;font-family:var(--font-mono);font-size:12px;color:var(--fg3);border-bottom:1px solid var(--cobalt-border-lo)">${esc(s.language)}</div>
      <pre style="margin:0;padding:24px;font-family:var(--font-mono);font-size:13px;line-height:1.7;color:var(--fg2);overflow-x:auto;white-space:pre">${esc(s.code)}</pre>
      ${s.caption ? `<div style="padding:10px 16px;font-family:var(--font-mono);font-size:11px;color:var(--fg3);border-top:1px solid var(--cobalt-border-lo)">${esc(s.caption)}</div>` : ""}
    </div>
  </div>
</section>`
}

function secGallery(s: { eyebrow?: string; heading?: string; italic?: string; body?: string; images: { cover: string; mono: string; label?: string; aspect?: string }[] }): string {
  const cols = s.images.length <= 2 ? "repeat(2,1fr)" : "repeat(3,1fr)"
  const imgs = s.images.map(img => coverBlock(img.cover, img.mono, img.aspect ?? "4/3", "18px")).join("")
  return `<section style="padding:clamp(56px,8vw,112px) 0;border-top:1px solid var(--cobalt-border-lo)">
  <div class="shell" style="display:flex;flex-direction:column;gap:40px">
    <div style="display:grid;grid-template-columns:5fr 7fr;gap:64px">
      <div>${sectionHeading(s.eyebrow, s.heading, s.italic)}</div>
      ${s.body ? `<div>${bodyText(s.body)}</div>` : "<div></div>"}
    </div>
    <div style="display:grid;grid-template-columns:${cols};gap:18px">${imgs}</div>
  </div>
</section>`
}

function secWideImage(s: { eyebrow?: string; heading?: string; italic?: string; body?: string; image: { cover: string; mono: string; label?: string; aspect?: string } }): string {
  return `<section style="padding:clamp(56px,8vw,112px) 0;border-top:1px solid var(--cobalt-border-lo)">
  <div class="shell" style="display:flex;flex-direction:column;gap:40px">
    <div style="display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:end">
      <div>${sectionHeading(s.eyebrow, s.heading, s.italic)}</div>
      ${s.body ? `<div>${bodyText(s.body)}</div>` : "<div></div>"}
    </div>
    ${coverBlock(s.image.cover, s.image.mono, s.image.aspect ?? "16/9", "24px")}
  </div>
</section>`
}

function secAsideImage(s: { eyebrow?: string; heading?: string; italic?: string; body: string | string[]; imageSide?: string; image: { cover: string; mono: string } }): string {
  const isLeft = s.imageSide === "left"
  return `<section style="padding:clamp(56px,8vw,112px) 0;border-top:1px solid var(--cobalt-border-lo)">
  <div class="shell" style="display:grid;grid-template-columns:${isLeft ? "5fr 6fr" : "6fr 5fr"};gap:56px;align-items:center">
    <div ${isLeft ? 'style="order:1"' : ""}>${sectionHeading(s.eyebrow, s.heading, s.italic)}<div style="margin-top:20px">${bodyText(s.body)}</div></div>
    <div style="position:relative;aspect-ratio:4/5;border-radius:24px;border:1px solid var(--cobalt-border-hi);overflow:hidden;box-shadow:0 32px 64px -16px rgba(0,0,0,.5)${isLeft ? ";order:0" : ""}">
      <div style="position:absolute;inset:0;background:${bg(s.image.cover)}"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-style:italic;font-size:clamp(4rem,10vw,8rem);color:rgba(255,255,255,.92)">${esc(s.image.mono)}</div>
    </div>
  </div>
</section>`
}

function secQuote(s: { body: string; who: string }): string {
  return `<section style="padding:clamp(80px,12vw,140px) 0;border-top:1px solid var(--cobalt-border-lo);text-align:center;background:radial-gradient(at 50% 50%,rgba(2,59,230,.1),transparent 60%)">
  <div class="shell">
    <span style="font-family:var(--font-display);font-style:italic;font-size:120px;line-height:.4;color:var(--cobalt-500);display:block;margin-bottom:12px">&ldquo;</span>
    <blockquote style="font-family:var(--font-display);font-style:italic;font-size:clamp(1.8rem,3.4vw,3rem);line-height:1.2;letter-spacing:-.025em;color:var(--fg1);margin:0 auto;max-width:22ch;text-wrap:balance">${renderInlineMarkup(esc(s.body))}</blockquote>
    <div style="margin-top:28px;font-family:var(--font-mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg3)">— ${esc(s.who)}</div>
  </div>
</section>`
}

function secStats(s: { eyebrow?: string; heading?: string; italic?: string; body?: string; stats: { value: string; label: string; emph?: boolean }[] }): string {
  const cells = s.stats.map((st, i) => `<div style="padding:28px 24px;border-right:${i < s.stats.length - 1 ? "1px solid var(--cobalt-border-lo)" : "none"};display:flex;flex-direction:column;gap:6px">
    <span style="font-family:var(--font-display);font-size:clamp(2.2rem,3.5vw,3rem);line-height:1;letter-spacing:-.04em;color:${st.emph ? "var(--cobalt-300)" : "var(--fg1)"};font-style:${st.emph ? "italic" : "normal"}">${esc(st.value)}</span>
    <span style="font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3)">${esc(st.label)}</span>
  </div>`).join("")
  return `<section style="padding:clamp(56px,8vw,112px) 0;border-top:1px solid var(--cobalt-border-lo)">
  <div class="shell" style="display:flex;flex-direction:column;gap:48px">
    <div style="max-width:60ch">${sectionHeading(s.eyebrow, s.heading, s.italic)}${s.body ? `<div style="margin-top:12px">${bodyText(s.body)}</div>` : ""}</div>
    <div style="display:grid;grid-template-columns:repeat(${s.stats.length},1fr);border-top:1px solid var(--cobalt-border);border-bottom:1px solid var(--cobalt-border);background:rgba(255,255,255,.012)">${cells}</div>
  </div>
</section>`
}

function heroSection(project: Project): string {
  if (!project.hero) return ""
  const h = project.hero
  const metrics = h.metrics.map((m, i) => `<div style="padding:26px 24px;border-right:${i < h.metrics.length - 1 ? "1px solid var(--cobalt-border-lo)" : "none"};display:flex;flex-direction:column;gap:6px">
    <span style="font-family:var(--font-display);font-size:clamp(2rem,3vw,2.6rem);line-height:1;letter-spacing:-.035em;color:${m.emph ? "var(--cobalt-300)" : "var(--fg1)"};font-style:${m.emph ? "italic" : "normal"}">${esc(m.v)}</span>
    <span style="font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3)">${esc(m.l)}</span>
  </div>`).join("")

  const tags = [
    project.role ? `<span class="tag"><strong style="color:var(--fg1);font-weight:500">ROLE</strong>&nbsp;&nbsp;${esc(project.role)}</span>` : "",
    project.client ? `<span class="tag"><strong style="color:var(--fg1);font-weight:500">CLIENT</strong>&nbsp;&nbsp;${esc(project.client)}</span>` : "",
    project.url ? `<span class="tag"><strong style="color:var(--fg1);font-weight:500">URL</strong>&nbsp;&nbsp;${esc(project.url)}</span>` : "",
    ...project.stack.slice(0, 4).map(s => `<span class="tag">${esc(s)}</span>`),
  ].filter(Boolean).join("")

  return `<section style="position:relative;padding:clamp(80px,12vw,160px) 0 clamp(48px,8vw,96px);overflow:hidden;isolation:isolate">
  <div style="position:absolute;inset:-10%;opacity:.6;z-index:0;background:var(--mesh-soft)"></div>
  <div class="shell" style="position:relative;z-index:1">
    <div style="display:flex;align-items:center;gap:14px;font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin-bottom:32px">
      <span style="color:var(--fg2)">← Kennik.dk</span>
      <span style="color:var(--fg-mute)">/</span><span>Work</span>
      <span style="color:var(--fg-mute)">/</span><span style="color:var(--fg1)">${esc(project.name)}</span>
    </div>
    <span style="display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin-bottom:18px"><span style="display:inline-block;width:32px;height:1px;background:var(--fg3)"></span>${esc(h.eyebrow)}</span>
    <h1 style="font-family:var(--font-display);font-size:clamp(2.5rem,7vw,6.4rem);line-height:.95;letter-spacing:-.04em;font-weight:400;color:var(--fg1);margin:18px 0 28px;max-width:22ch;text-wrap:balance">${renderInlineMarkup(esc(h.headline))}</h1>
    <p style="font-size:clamp(1.1rem,1.5vw,1.3rem);color:var(--fg2);max-width:60ch;line-height:1.55;margin:0 0 40px">${esc(h.summary)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:56px">${tags}</div>
    <div style="display:grid;grid-template-columns:repeat(${h.metrics.length},1fr);border-top:1px solid var(--cobalt-border);border-bottom:1px solid var(--cobalt-border);background:rgba(255,255,255,.012)">${metrics}</div>
    <div style="margin-top:64px;position:relative;aspect-ratio:16/9;border-radius:32px;border:1px solid var(--cobalt-border-hi);overflow:hidden;box-shadow:0 40px 80px -20px rgba(0,0,0,.5)">
      ${(project.heroImage ?? project.coverImage)
        ? `<img src="${esc(project.heroImage ?? project.coverImage ?? "")}" alt="${esc(project.name)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>`
        : `<div style="position:absolute;inset:0;background:${bg(h.cover)}"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-style:italic;font-size:clamp(5rem,14vw,13rem);color:rgba(255,255,255,.94);letter-spacing:-.04em;text-shadow:0 4px 32px rgba(0,0,0,.5)">${esc(project.monogram)}</div>`}
    </div>
  </div>
</section>`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSection(s: any): string {
  switch (s.kind) {
    case "prose":       return secProse(s)
    case "split":       return secSplit(s)
    case "callout":     return secCallout(s)
    case "code":        return secCode(s)
    case "gallery":     return secGallery(s)
    case "wide-image":  return secWideImage(s)
    case "aside-image": return secAsideImage(s)
    case "quote":       return secQuote(s)
    case "stats":       return secStats(s)
    default:            return `<section style="padding:40px 0;border-top:1px solid var(--cobalt-border-lo)"><div class="shell"><span style="font-family:var(--font-mono);font-size:12px;color:var(--fg3)">Unknown section kind: ${esc(String(s.kind))}</span></div></section>`
  }
}

function relatedSection(project: Project): string {
  const related = project.related
  if (!related || !related.length) return ""

  const cards = related.map(p => `
  <a href="/work/${esc(p.slug)}" style="position:relative;border:1px solid var(--cobalt-border);border-radius:24px;overflow:hidden;display:grid;grid-template-columns:220px 1fr;background:var(--ink-800);text-decoration:none;transition:border-color .24s">
    <div style="position:relative;aspect-ratio:1/1;border-right:1px solid var(--cobalt-border-lo)">
      <div style="position:absolute;inset:0;background:${bg(p.cover)}"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-style:italic;font-size:3rem;color:rgba(255,255,255,.92);letter-spacing:-.04em">${esc(p.monogram)}</div>
    </div>
    <div style="padding:22px 22px 20px;display:flex;flex-direction:column;justify-content:space-between;gap:12px">
      <h4 style="font-family:var(--font-display);font-size:24px;line-height:1;letter-spacing:-.04em;font-weight:400;color:var(--fg1);margin:0">${esc(p.name)} <em style="font-style:italic;color:var(--fg2)">— ${esc(p.italic)}</em></h4>
      <span style="font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--cobalt-300)">View case ↗</span>
    </div>
  </a>`).join("")

  return `<section style="padding:clamp(64px,10vw,128px) 0;border-top:1px solid var(--cobalt-border);background:var(--ink-950)">
  <div class="shell">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;gap:24px;flex-wrap:wrap">
      <div>
        <span style="display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin-bottom:12px"><span style="display:inline-block;width:32px;height:1px;background:var(--fg3)"></span>NEXT UP — MORE WORK</span>
        <h3 style="font-family:var(--font-display);font-size:clamp(1.8rem,3vw,2.6rem);font-weight:400;letter-spacing:-.03em;color:var(--fg1);margin:8px 0 0">Other things <em style="font-style:italic;color:var(--fg2)">I&apos;ve shipped.</em></h3>
      </div>
      <a href="/#work" style="display:inline-flex;align-items:center;gap:8px;padding:13px 20px;font-size:14px;color:var(--fg2);border-radius:9999px;border:1px solid var(--cobalt-border);text-decoration:none">See all →</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:18px">${cards}</div>
  </div>
</section>`
}

function buildPreviewHtml(project: Project): string {
  const sections = (project.sections ?? []).map(renderSection).join("\n")

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Preview — ${esc(project.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
:root {
  --font-display: "Instrument Serif", Georgia, serif;
  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;
  --cobalt-300: #5A82FB;
  --cobalt-400: #2B5BF1;
  --cobalt-500: #023BE6;
  --cobalt-border: rgba(255,255,255,.08);
  --cobalt-border-hi: rgba(255,255,255,.14);
  --cobalt-border-lo: rgba(255,255,255,.04);
  --ink-950: #050609;
  --ink-800: #10121A;
  --bg: var(--ink-950);
  --surface: var(--ink-800);
  --fg1: #F4F5F8;
  --fg2: #B7BBC7;
  --fg3: #8A8F9F;
  --fg-mute: #5C6273;
  --mesh-soft: radial-gradient(at 30% 20%, rgba(2,59,230,.22) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(178,102,255,.14) 0px, transparent 55%), var(--ink-950);
  --grain-url: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
  --success: #2BD178;
}
*,*::before,*::after { box-sizing: border-box; }
html { color-scheme: dark; }
body { margin: 0; background: var(--bg); color: var(--fg1); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
h1,h2,h3,h4 { margin: 0; font-family: var(--font-display); font-weight: 400; }
p { margin: 0; }
em { font-style: italic; }
strong { font-weight: 600; }
.shell { max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px,4vw,56px); }
.tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .12em;
  border: 1px solid var(--cobalt-border); border-radius: 9999px; padding: 4px 10px;
  color: var(--fg3);
}
</style>
</head>
<body>
${heroSection(project)}
${sections}
${relatedSection(project)}
</body>
</html>`
}
