import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

async function main() {
  // ── FAQs ─────────────────────────────────────────────────────────────
  await prisma.faq.deleteMany()
  await prisma.faq.createMany({
    data: [
      {
        order: 0,
        q: "Are you available right now?",
        a: "Two slots open in Q3 2026 — Q1 2027. If your project is later than that, get on the list and I'll reply when a slot opens. If it's urgent, ask anyway — I sometimes have a week to spare between long engagements.",
      },
      {
        order: 1,
        q: "Do you work alone or with a team?",
        a: "Alone, by default. For builds longer than 10 weeks I'll bring in one trusted designer or one frontend specialist if the scope needs it — always announced up front, never subcontracted invisibly.",
      },
      {
        order: 2,
        q: "What's the fastest you can start?",
        a: "If the brief is clear, I can start the same week. If we need to scope first, count on a week of back-and-forth. I never start without a one-page signed brief.",
      },
      {
        order: 3,
        q: "Do you do design?",
        a: "I design competently, not artfully. For greenfield products I usually bring in a designer for the first two weeks. For dashboards and internal tools I'm fine on my own.",
      },
      {
        order: 4,
        q: "Will you sign an NDA?",
        a: "Yes. I have a one-page mutual NDA I can send. I won't sign 14-page corporate ones without striking a few clauses — happy to walk through which.",
      },
      {
        order: 5,
        q: "Where are you based?",
        a: "Copenhagen, Denmark. I work GMT+1 hours, overlap 4 hours with US East, full overlap with EU. I travel to a client kickoff once per engagement when it makes sense.",
      },
      {
        order: 6,
        q: "What if you underestimate?",
        a: "Fixed-scope means I eat the overrun. The flip side: I'm conservative on the brief. If we hit a real change in scope, we re-paper it together — but bugs in my plan are on me.",
      },
      {
        order: 7,
        q: "Do you take equity?",
        a: "Not as full payment. I'll take up to 25% of a fee as equity in a post-revenue company I believe in, but the rest is cash. If you're pre-revenue, cash only.",
      },
    ],
  })

  // ── PACKAGES ─────────────────────────────────────────────────────────
  const packages = [
    {
      id: "rescue",
      order: 0,
      name: "Rescue",
      italic: "a fire to put out.",
      price: "from €4.5k",
      duration: "1–2 weeks",
      blurb:
        "Something is on fire. I diagnose, fix, document. Best for: a regression, a missed deadline, a contractor who left.",
      includes: [
        "Audit + root-cause",
        "Hands-on fixes",
        "Runbook + handover",
        "Slack support · 1 week",
      ],
      cta: "Start a rescue",
      featured: false,
    },
    {
      id: "build",
      order: 1,
      name: "Build",
      italic: "the whole product.",
      price: "from €18k",
      duration: "6–12 weeks",
      blurb:
        "End-to-end. Architecture, code, infra, observability. You get a working product on Fly or Vercel and the keys.",
      includes: [
        "Discovery + scope",
        "Production build",
        "CI/CD + monitoring",
        "Friday demos",
        "30-day warranty",
        "Full docs + ADRs",
      ],
      cta: "Plan a build",
      featured: true,
    },
    {
      id: "retainer",
      order: 2,
      name: "Retainer",
      italic: "on speed-dial.",
      price: "€6k / month",
      duration: "rolling 90-day",
      blurb:
        "A senior pair of eyes for your team. Weekly review, on-call for incidents, hands-on for two days per month.",
      includes: [
        "Weekly architecture review",
        "PR review · unlimited",
        "2 hands-on days / month",
        "Incident on-call · business hrs",
      ],
      cta: "Book a retainer",
      featured: false,
    },
  ]
  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { id: pkg.id },
      update: pkg,
      create: pkg,
    })
  }

  // ── TESTIMONIALS ─────────────────────────────────────────────────────
  await prisma.testimonial.deleteMany()
  await prisma.testimonial.createMany({
    data: [
      {
        order: 0,
        quote:
          "Shipped in 6 weeks what our team had been grinding on for 6 months. Diagnosed the data layer in the first call.",
        who: "Cofounder",
        co: "Mailroom",
        initials: "AM",
      },
      {
        order: 1,
        quote:
          "Took our checkout from 3.4s to 740ms in two weeks. Wrote a 14-page handover. We've not had to think about it since.",
        who: "Head of Eng",
        co: "Field & Co.",
        initials: "JR",
      },
      {
        order: 2,
        quote:
          "Rare to find someone who codes well and writes well. The post-mortem he sent us is in our onboarding doc now.",
        who: "CTO",
        co: "Halftrack",
        initials: "EB",
      },
      {
        order: 3,
        quote:
          "I've worked with 11 contractors. He's the only one whose code I haven't had to rewrite.",
        who: "Founder",
        co: "Atlas (stealth)",
        initials: "SK",
      },
    ],
  })

  // ── SERVICES ─────────────────────────────────────────────────────────
  const services = [
    {
      id: "problem",
      order: 0,
      title: "Problem solving",
      italic: "with code.",
      desc: "You have a problem, and you also don't have a solution. We work together to find a solution, and I build it. From idea to production, with a focus on maintainability and performance.",
      deliverables: [
        "Technical architecture & data schema",
        "Deployed production application",
        "CI/CD pipeline + error monitoring",
        "Handover docs & async walkthrough",
      ],
      examples: [
        "A platform where clients can log in and manage their account",
        "A tool that replaces a messy spreadsheet workflow",
        "A dashboard that pulls data from multiple sources",
        "An admin panel built around how your team actually works",
      ],
      icon: "spark",
      duration: "6–16 weeks",
    },
    {
      id: "idea",
      order: 1,
      title: "From idea",
      italic: "to reality.",
      desc: "You have something in mind, and you want it built. That could be a new feature, a new service, or a whole new product. I take your idea, shape it into a plan, and build it in a way that makes it easy to maintain and iterate on.",
      deliverables: [
        "Scoped spec with timeline",
        "Working feature in production",
        "Tests covering critical paths",
        "Knowledge transfer session",
      ],
      examples: [
        "Add a payment flow to an existing app",
        "A page where customers can manage their subscription",
        "Connect your app to a CRM or invoicing tool",
        "Send users emails or texts when something happens",
      ],
      icon: "shield",
      duration: "4–16 weeks",
    },
    {
      id: "extension",
      order: 2,
      title: "Extension",
      italic: "of something that already exists.",
      desc: "You have something that works, but it needs to be faster, more reliable, do more, or just better in some way. I dive into the codebase or system, and fulfill your requests.",
      deliverables: [
        "Performance profiling report",
        "Targeted refactors with rationale",
        "Before/after benchmarks",
        "Recommended maintenance roadmap",
      ],
      examples: [
        "The app is slow and you don't know why",
        "Users need to search, but there's no search",
        "One bug breaks everything — it needs untangling",
        "The codebase scares new developers away",
      ],
      icon: "gauge",
      duration: "2–6 weeks",
    },
    {
      id: "ai",
      order: 3,
      title: "Automation",
      italic: "With AI.",
      desc: "Everywhere there are repetitive tasks, there is an opportunity for automation. I can build custom AI agents/workflows that integrate with your existing tools and workflows, to save you time and money.",
      deliverables: [
        "Evaluation harness with test cases",
        "Production-grade AI pipeline",
        "Token cost & latency dashboard",
        "Human-in-the-loop fallback paths",
      ],
      examples: [
        "Automatically pull data from incoming emails",
        "A chatbot that answers from your own docs",
        "Summarise and categorise documents as they come in",
        "Get images analyzed with custom labels and metadata extracted",
      ],
      icon: "ai",
      duration: "4–10 weeks",
    },
  ]
  for (const svc of services) {
    await prisma.service.upsert({
      where: { id: svc.id },
      update: svc,
      create: svc,
    })
  }

  // ── PROJECT STATS ─────────────────────────────────────────────────────
  await prisma.projectStat.deleteMany()
  await prisma.projectStat.createMany({
    data: [
      { order: 0, v: "42+", label: "SHIPPED PROJECTS · CAREER" },
      { order: 1, v: "€2.4M", label: "CLIENT ARR INFLUENCED · 2025" },
      { order: 2, v: "96%", label: "REPEAT-CLIENT RATE · 5 YR" },
      { order: 3, v: "0", label: "P0 INCIDENTS · LAST 18 MOS" },
    ],
  })

  // ── PROCESS STEPS ─────────────────────────────────────────────────────
  await prisma.processStep.deleteMany()
  await prisma.processStep.createMany({
    data: [
      {
        order: 0,
        n: "01",
        t: "Brief",
        italic: "20-minute call.",
        body: "Tell me what's broken or what's missing. I ask three uncomfortable questions. We decide if it's a fit. No pitch deck.",
      },
      {
        order: 1,
        n: "02",
        t: "Meeting",
        italic: "We talk it out.",
        body: "I ask a lot of questions. We figure out what to build, how to measure success, and what the timeline looks like. I send a proposal within 48 hours.",
      },
      {
        order: 2,
        n: "03",
        t: "Initiate project",
        italic: "in writing.",
        body: "I send a scoped proposal with deliverables, timeline, and cost. We sign it. I invoice 50% upfront, 50% on delivery.",
      },
      {
        order: 3,
        n: "04",
        t: "Build",
        italic: "Weekly updates.",
        body: "I start working on the project. I send progress reports and visuals every week, and potentially ask for feedback or decisions as I go.",
      },
      {
        order: 4,
        n: "05",
        t: "Ship",
        italic: "to production.",
        body: "Final check, delivery and deployment. I make sure everything is working in production, and I provide documentation and a walkthrough to make sure you can maintain it after I'm gone.",
      },
      {
        order: 5,
        n: "06",
        t: "After",
        italic: "a month of warranty.",
        body: "30 days of bug fixes on me. Maintenance and support after the warranty period can be arranged for a monthly retainer if needed, but most clients don't.",
      },
    ],
  })

  // ── STACK GROUPS ──────────────────────────────────────────────────────
  await prisma.stackGroup.deleteMany()
  await prisma.stackGroup.createMany({
    data: [
      {
        order: 0,
        group: "Languages",
        items: ["TypeScript", "Python", "Dart", "SQL", "C#", "Swift"],
      },
      {
        order: 1,
        group: "Frameworks",
        items: ["Next.js", "Svelte", "Flutter", "React Native", "React"],
      },
      {
        order: 2,
        group: "Data",
        items: ["Postgres", "MySQL", "Redis", "Firebase", "Supabase", "Neo4j"],
      },
      {
        order: 3,
        group: "Infra",
        items: ["Vercel", "AWS", "Azure", "Firebase", "Docker"],
      },
      {
        order: 4,
        group: "AI",
        items: ["Anthropic", "OpenAI", "Vercel AI SDK", "Ollama"],
      },
      {
        order: 5,
        group: "DX",
        items: ["npm", "Vitest", "CI/CD", "GitHub Actions", "TailwindCSS"],
      },
    ],
  })

  // ── STACK MARQUEE ─────────────────────────────────────────────────────
  await prisma.stackMarqueeItem.deleteMany()
  await prisma.stackMarqueeItem.createMany({
    data: [
      "Postgres",
      "TypeScript",
      "Python",
      "Dart",
      "Next.js",
      "Svelte",
      "Flutter",
      "React Native",
      "React",
      "Postgres",
      "MySQL",
      "Redis",
      "Firebase",
      "Supabase",
      "Neo4j",
      "Vercel",
      "AWS",
      "Azure",
      "Firebase",
      "Docker",
      "Anthropic",
      "OpenAI",
      "Vercel AI SDK",
      "Ollama",
      "npm",
      "Vitest",
      "CI/CD",
      "GitHub Actions",
      "TailwindCSS",
      "Remix",
    ].map((name, i) => ({ order: i, name })),
  })

  // ── VALUE REASONS ─────────────────────────────────────────────────────
  await prisma.valueReason.deleteMany()
  await prisma.valueReason.createMany({
    data: [
      {
        order: 0,
        t: "Maintainable code",
        b: "I write code that your team can understand and maintain. No clever tricks, just clear, well-structured code that gets the job done.",
      },
      {
        order: 1,
        t: "Data caching",
        b: "I use caching strategies to make your app faster, responsive and cheaper to run, even under heavy load. I can cache data at the edge, in memory, or wherever it makes sense for your project.",
      },
      {
        order: 2,
        t: "Security best practices",
        b: "I follow security best practices to protect your app and your users. I can help you avoid common vulnerabilities, and I can review your code for security issues.",
      },
      {
        order: 3,
        t: "Scalable architecture",
        b: "I design your app's architecture to be scalable and flexible, so it can grow with your business. I can help you choose the right technologies and patterns to make sure your app can handle increased traffic and complexity over time.",
      },
      {
        order: 4,
        t: "Solid SEO",
        b: "I implement SEO best practices to help your app rank higher in search engine results. I can optimize your content, structure, and performance to improve visibility and drive more organic traffic.",
      },
      {
        order: 5,
        t: "Not just a WordPress site",
        b: "I build custom solutions that go beyond the limitations of WordPress, providing you with unique and tailored features for your users.",
      },
    ],
  })

  // ── PROBLEMS ──────────────────────────────────────────────────────────
  await prisma.problem.deleteMany()
  await prisma.problem.createMany({
    data: [
      {
        order: 0,
        p: "Our site don't get any visitors",
        s: "Let me fix your SEO.",
      },
      {
        order: 1,
        p: "I vibe coded a project, but is it secure?",
        s: "I can review your code and fix vulnerabilities.",
      },
      {
        order: 2,
        p: "My website needs a redesign",
        s: "I can create a modern, user-friendly design.",
      },
      {
        order: 3,
        p: "We need a mobile app",
        s: "I can build a cross-platform mobile app.",
      },
      {
        order: 4,
        p: "Our site is too slow",
        s: "I can improve your site's performance.",
      },
      {
        order: 5,
        p: "We have the world's messiest Excel sheets",
        s: "That could be a web app instead.",
      },
      {
        order: 6,
        p: "I need a quick demo for my side project",
        s: "I can build a functional prototype quickly.",
      },
      {
        order: 7,
        p: "We built it ourselves and now it's a mess",
        s: "I can clean up your codebase and make it maintainable.",
      },
      {
        order: 8,
        p: "We're paying too much for our infrastructure",
        s: "I can optimize your hosting and save you money.",
      },
      {
        order: 9,
        p: "We need to automate this repetitive internal process",
        s: "I can build a tool to automate it and save you time.",
      },
      {
        order: 10,
        p: "We got hacked, or we're worried we will be",
        s: "I can audit your security and fix vulnerabilities.",
      },
      {
        order: 11,
        p: "We have data but can't make sense of it",
        s: "I can build a dashboard to visualize your data and help you make informed decisions.",
      },
    ],
  })

  // ── PROJECTS ──────────────────────────────────────────────────────────
  const projects = [
    {
      slug: "halftrack",
      order: 0,
      name: "Inventory management system",
      italic: "Svendborgsund bryghus",
      desc: "A custom inventory management system for a Danish brewery. Replaced a messy Excel workflow with a tailored web app, improving efficiency and accuracy of inventory management, tax reporting, and overall operations.",
      cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
      monogram: "Sb",
      year: "2026",
      duration: "10 weeks",
      status: "LIVE" as const,
      stack: ["Next.js", "Postgres", "Prisma", "Vercel"],
      role: "Solo full-stack",
      client: "Svendborgsund Bryghus",
      url: "svendborgsundbryghus.dk",
      hero: {
        eyebrow: "CASE STUDY · 2026",
        headline: "From *Excel chaos* to a dashboard that *runs itself.*",
        summary:
          "A custom inventory management system that replaced a brittle multi-spreadsheet workflow with a purpose-built web app — including real-time stock tracking, automated tax reports, and a procurement flow the team actually uses.",
        metrics: [
          { v: "0", l: "Manual reports per week", emph: true },
          { v: "4h →", l: "Previous weekly reporting time" },
          { v: "99.9%", l: "Inventory accuracy" },
          { v: "3 weeks", l: "To full adoption" },
        ],
        cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
      },
      sections: [
        {
          kind: "split",
          heading: "The brief",
          italic: "was a shared Google Sheet.",
          body: [
            "Svendborgsund Bryghus had grown from a two-person passion project to a team of eight. Inventory still lived in four loosely related spreadsheets — one per category, manually synced every Friday, by hand.",
            "Tax reporting was a half-day exercise. Procurement was a phone call followed by hand-entering receipts. The owner wanted a system before the next SKAT audit.",
          ],
          meta: [
            { l: "BRIEF", v: '"Make the spreadsheets go away"' },
            { l: "TIMELINE", v: "10 weeks, fixed scope" },
            { l: "TEAM", v: "Me, solo" },
            { l: "CONSTRAINTS", v: "Must work on tablet in the brewhouse" },
          ],
        },
        {
          kind: "prose",
          eyebrow: "WEEK 01 — DISCOVERY",
          heading: "Three days in the brewery,",
          italic: "two days writing nothing.",
          body: [
            "I spent the first week not writing code. I followed the head brewer through a full brew cycle, watched the Friday reconciliation from start to finish, and sat in on the monthly procurement call.",
            "The pattern was clear: the pain wasn't the spreadsheets themselves — it was that three people were maintaining three different versions of the truth, and reconciliation was the only checkpoint.",
          ],
        },
        {
          kind: "callout",
          label: "DECISION",
          heading: "One source of truth,",
          italic: "real-time everywhere.",
          body: "Rather than migrating the spreadsheet model into a database, I modelled stock as a stream of events — every batch produced, every ingredient consumed, every delivery received — and derived current state from that log. This gave us an audit trail for SKAT for free.",
        },
        {
          kind: "code",
          eyebrow: "WEEK 03 — DATA MODEL",
          heading: "Stock as events,",
          italic: "not rows.",
          body: "Each stock movement — intake, consumption, waste, adjustment — is an immutable event. Current inventory is a materialised view over that log. This pattern gave us audit-readiness on day one and made the SKAT export a two-line query.",
          language: "sql",
          code: `-- materialised current stock per ingredient
SELECT
  ingredient_id,
  sum(qty) FILTER (WHERE kind = 'intake')    AS received,
  sum(qty) FILTER (WHERE kind = 'consumed')  AS used,
  sum(qty) FILTER (WHERE kind = 'intake')
    - sum(qty) FILTER (WHERE kind = 'consumed')
    - coalesce(sum(qty) FILTER (WHERE kind = 'waste'), 0)
    AS on_hand
FROM stock_events
GROUP BY ingredient_id;

-- SKAT afgiftsrapport — ethanol produced last quarter
SELECT
  date_trunc('month', produced_at) AS month,
  sum(volume_litres * abv / 100)   AS pure_ethanol_litres
FROM batch_events
WHERE produced_at >= now() - interval '3 months'
GROUP BY 1
ORDER BY 1;`,
          caption:
            "Both queries run in under 4ms on the production dataset. No cron jobs, no nightly aggregation — the view is always fresh.",
        },
        {
          kind: "stats",
          eyebrow: "IMPACT",
          heading: "Numbers that moved",
          italic: "after go-live.",
          stats: [
            { value: "4h", label: "Weekly reporting → 0", emph: true },
            { value: "99.9%", label: "Inventory accuracy" },
            { value: "3 wks", label: "Full team adoption" },
            { value: "0", label: "Findings at SKAT audit" },
          ],
        },
        {
          kind: "aside-image",
          eyebrow: "WEEK 06 — BREWHOUSE UI",
          heading: "A tablet-first UI",
          italic: "that works with wet hands.",
          body: [
            "The brewhouse floor has water, CO₂, and people in a hurry. The interface needed to be operable with one hand on a 10-inch tablet, with large touch targets and no tiny form fields.",
            "I used a step-based intake flow — scan barcode, confirm quantity, done — so a delivery receipt takes 40 seconds instead of ten minutes of back-office entry.",
          ],
          imageSide: "right",
          image: {
            cover:
              "linear-gradient(135deg, #0030C2 0%, #050609 60%, #5DE2FF 100%)",
            mono: "UI",
            label: "BREWHOUSE · TABLET VIEW",
          },
        },
        {
          kind: "gallery",
          eyebrow: "WEEK 08 — DASHBOARD",
          heading: "Three views,",
          italic: "one source of truth.",
          body: "The dashboard adapts to three roles: the brewer sees live batch status; the owner sees stock value and margin; the accountant sees the SKAT-ready export queue.",
          images: [
            {
              cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
              mono: "01",
              label: "STOCK · OVERVIEW",
            },
            {
              cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
              mono: "02",
              label: "BATCH · TRACKER",
            },
            {
              cover:
                "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
              mono: "03",
              label: "REPORTS · SKAT",
            },
          ],
        },
        {
          kind: "wide-image",
          eyebrow: "WEEK 09 — LAUNCH",
          heading: "Two weeks of parallel running,",
          italic: "then the spreadsheets closed.",
          body: "We ran the new system alongside the spreadsheets for two weeks. Every Friday reconciliation was done twice — old way and new way — and results compared. The last delta was a single barrel of malt that was logged in both systems on the same day. Fixed in ten seconds.",
          image: {
            cover:
              "linear-gradient(135deg, #001A70 0%, #023BE6 50%, #5DE2FF 100%)",
            mono: "∑",
            label: "PARALLEL RUN · WEEK 9 DIFF",
            aspect: "21/9",
          },
        },
        {
          kind: "quote",
          body: "I thought I'd need to explain it to the team. They figured it out in an afternoon. *The SKAT audit was the first one in five years with zero follow-up questions.*",
          who: "MH · Owner, Svendborgsund Bryghus",
        },
        {
          kind: "split",
          heading: "Outcome",
          italic: "and what the team does differently now.",
          body: [
            "Four hours of weekly reporting collapsed to zero — the SKAT export runs with one click. Inventory accuracy jumped from a best-guess to a measured 99.9%, and the first tax audit under the new system came back clean.",
            "The team picked it up in an afternoon. The brewhouse tablet is the first thing the head brewer checks in the morning.",
          ],
          meta: [
            { l: "REPORTING TIME", v: "4h → 0" },
            { l: "AUDIT FINDINGS", v: "0" },
            { l: "ADOPTION", v: "3 weeks" },
            { l: "STACK", v: "Next.js · Postgres · Vercel" },
          ],
        },
      ],
      related: [
        {
          slug: "mailroom",
          name: "Fashion store website",
          italic: "Hyperfashion.dk",
          monogram: "Hf",
          cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
        },
        {
          slug: "atlas",
          name: "Admin CMS",
          italic: "with dashboard and analytics.",
          monogram: "At",
          cover:
            "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
        },
      ],
    },
    {
      slug: "mailroom",
      order: 1,
      name: "Fashion store website",
      italic: "Hyperfashion.dk",
      desc: "Made a new website for a Danish fashion store. The old one was built on a clunky CMS that didn't let the client manage their content properly. The new one is built on Next.js and has a custom CMS that makes it easy for the client to manage their products, orders, and content.",
      cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
      monogram: "Hf",
      year: "2025",
      duration: "4 weeks",
      status: "LIVE" as const,
      stack: ["Next.js", "Postgres", "Clerk", "Resend"],
      role: "Solo full-stack",
      client: "Hyperfashion.dk",
      url: "hyperfashion.dk",
      hero: {
        eyebrow: "CASE STUDY · 2025",
        headline: "A fashion store that *loads fast* and *converts better.*",
        summary:
          "Replaced a slow, inflexible CMS with a purpose-built Next.js storefront. Custom content management, aggressive caching, and a checkout flow that doesn't get in the way.",
        metrics: [
          { v: "1.2s", l: "LCP (was 4.8s)", emph: true },
          { v: "+34%", l: "Conversion rate" },
          { v: "100", l: "Lighthouse score" },
          { v: "4 wks", l: "Delivered" },
        ],
        cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
      },
      sections: [
        {
          kind: "prose",
          eyebrow: "THE PROBLEM",
          heading: "A CMS that punished",
          italic: "everyone who touched it.",
          body: [
            "The old site ran on a platform the client had outgrown. Adding a product required touching three separate screens. The homepage was a template the client couldn't edit without breaking the layout. Sales required manual discount codes entered into a spreadsheet.",
            "The site was also slow — 4.8s LCP on mobile — because every page load fetched live from an underpowered shared server with no CDN.",
          ],
        },
        {
          kind: "callout",
          label: "APPROACH",
          heading: "Static where possible,",
          italic: "dynamic only where needed.",
          body: "Product pages, collection pages, and editorial content are all statically generated at build time and served from Vercel's edge network. Cart, checkout, and account pages are dynamic. This split cuts infrastructure cost to near-zero while handling traffic spikes during sales without breaking a sweat.",
        },
        {
          kind: "stats",
          eyebrow: "PERFORMANCE",
          heading: "Numbers after launch.",
          stats: [
            { value: "1.2s", label: "LCP on mobile", emph: true },
            { value: "+34%", label: "Conversion vs old site" },
            { value: "100", label: "Lighthouse performance" },
            { value: "€0", label: "Infra cost at idle" },
          ],
        },
      ],
      related: [
        {
          slug: "halftrack",
          name: "Inventory management system",
          italic: "Svendborgsund bryghus",
          monogram: "Sb",
          cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
        },
        {
          slug: "atlas",
          name: "Admin CMS",
          italic: "with dashboard and analytics.",
          monogram: "At",
          cover:
            "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
        },
      ],
    },
    {
      slug: "atlas",
      order: 2,
      name: "Admin CMS",
      italic: "with dashboard and analytics.",
      desc: "A custom admin CMS for a restaurant ordering system. Dashboard with analytics and a custom CMS for managing menu items, orders, and customers.",
      cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
      monogram: "At",
      year: "2025",
      duration: "8 weeks",
      status: "LIVE" as const,
      stack: ["Python", "pgvector", "Anthropic", "Modal"],
      role: "Solo full-stack",
      client: "School project",
      url: "atlas-demo.vercel.app",
      hero: {
        eyebrow: "CASE STUDY · 2025",
        headline: "An *AI-powered* CMS that *writes its own copy.*",
        summary:
          "A full admin CMS for a restaurant ordering system, with AI-assisted menu descriptions, real-time order analytics, and a customer insights dashboard powered by pgvector embeddings.",
        metrics: [
          { v: "2×", l: "Faster menu updates", emph: true },
          { v: "8 wks", l: "End to end" },
          { v: "pgvector", l: "Semantic search" },
          { v: "GPT-4o", l: "Copy generation" },
        ],
        cover: "linear-gradient(135deg, #050609 0%, #023BE6 70%, #B266FF 100%)",
      },
      sections: [
        {
          kind: "prose",
          eyebrow: "THE BRIEF",
          heading: "A restaurant CMS",
          italic: "that understands food.",
          body: [
            "The project started as a school assignment to build a complete restaurant ordering system. The frontend (customer-facing ordering) was handled by another team. I owned the admin layer: menu management, order fulfilment, and analytics.",
            "I added an AI layer on top: paste in a dish name and ingredients, and the CMS generates a menu description in the restaurant's voice. Managers can edit, approve, or regenerate.",
          ],
        },
      ],
      related: [
        {
          slug: "halftrack",
          name: "Inventory management system",
          italic: "Svendborgsund bryghus",
          monogram: "Sb",
          cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
        },
        {
          slug: "mailroom",
          name: "Fashion store website",
          italic: "Hyperfashion.dk",
          monogram: "Hf",
          cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
        },
      ],
    },
    {
      slug: "courier",
      order: 3,
      name: "Webshop",
      italic: "demo",
      desc: "A demo webshop to develop my understanding of Stripe's API and to have a reference implementation for future projects.",
      cover: "linear-gradient(135deg, #0030C2 0%, #050609 60%, #5DE2FF 100%)",
      monogram: "Cr",
      year: "2024",
      duration: "3 weeks",
      status: "RESCUED" as const,
      stack: ["Rails", "Postgres", "Sidekiq", "Hotwire"],
      role: "Solo",
      client: "Personal project",
      url: "courier-demo.fly.dev",
      hero: {
        eyebrow: "SIDE PROJECT · 2024",
        headline: "A *Stripe reference* implementation, *production-grade.*",
        summary:
          "Built to learn Stripe's API properly. Full checkout flow, webhooks, subscription billing, and a Sidekiq-backed fulfillment queue. Runs on Fly.io.",
        metrics: [
          { v: "3 wks", l: "Built in", emph: true },
          { v: "100%", l: "Webhook reliability" },
          { v: "0", l: "Failed payments" },
          { v: "Rails 8", l: "Stack" },
        ],
        cover: "linear-gradient(135deg, #0030C2 0%, #050609 60%, #5DE2FF 100%)",
      },
      sections: [
        {
          kind: "prose",
          eyebrow: "WHY",
          heading: "Learning Stripe",
          italic: "the hard way.",
          body: [
            "I'd integrated Stripe in projects before, but always through a higher-level library that abstracted away the webhook handling, idempotency keys, and event ordering. I wanted to understand the primitives.",
            "So I built a demo webshop from scratch: product catalogue, cart, checkout, Stripe Checkout redirect, webhook receiver, fulfilment queue, and a basic admin. No shortcuts.",
          ],
        },
      ],
      related: [
        {
          slug: "halftrack",
          name: "Inventory management system",
          italic: "Svendborgsund bryghus",
          monogram: "Sb",
          cover: "linear-gradient(135deg, #023BE6 0%, #5DE2FF 100%)",
        },
        {
          slug: "mailroom",
          name: "Fashion store website",
          italic: "Hyperfashion.dk",
          monogram: "Hf",
          cover: "linear-gradient(135deg, #2B5BF1 0%, #B266FF 100%)",
        },
      ],
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
