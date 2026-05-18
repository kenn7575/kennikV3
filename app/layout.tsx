import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://kennik.dk"),
  title: {
    default: "Kennik Kollemorten — Freelance Full-Stack Developer, Svendborg",
    template: "%s — Kennik.dk",
  },
  description:
    "Svendborg-based freelance full-stack developer. I build fast, scalable web products end-to-end — from architecture to deployment. Available for new projects.",
  keywords: [
    "freelance developer",
    "full-stack developer",
    "Svendborg",
    "Next.js",
    "TypeScript",
    "React",
    "web development",
  ],
  authors: [{ name: "Kennik Kollemorten", url: "https://kennik.dk" }],
  creator: "Kennik Kollemorten",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kennik.dk",
    siteName: "Kennik.dk",
    title: "Kennik Kollemorten — Freelance Full-Stack Developer, Svendborg",
    description:
      "Svendborg-based freelance full-stack developer. I build fast, scalable web products end-to-end — from architecture to deployment.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Kennik Kollemorten — Freelance Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kennik Kollemorten — Freelance Full-Stack Developer, Svendborg",
    description:
      "Svendborg-based freelance full-stack developer. Fast, scalable web products end-to-end.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://kennik.dk",
  },
}
const fontDisplay = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
})

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontDisplay.variable,
        fontSans.variable,
        fontMono.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
