"use server"

import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"
import { headers } from "next/headers"
import { Resend } from "resend"
import { createElement } from "react"
import { ContactConfirmationEmail } from "@/lib/emails/contact-confirmation"

type ContactPayload = {
  name: string
  email: string
  project: string
  message: string
}

// In-memory rate limit store: ip -> array of timestamps
const rateLimitStore = new Map<string, number[]>()
const RATE_LIMIT_MAX = 2
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const timestamps = (rateLimitStore.get(ip) ?? []).filter(
    (t) => t > windowStart
  )
  if (timestamps.length >= RATE_LIMIT_MAX) return false
  rateLimitStore.set(ip, [...timestamps, now])
  return true
}

export async function sendContactNotification(payload: ContactPayload) {
  const headersList = await headers()
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  const userAgent = headersList.get("user-agent") ?? "unknown"
  const referer = headersList.get("referer") ?? "direct"

  if (!checkRateLimit(ip)) {
    throw new Error("Too many submissions — please try again later.")
  }

  const token = process.env.DISCORD_BOT_TOKEN
  const channelId = process.env.DISCORD_CHANNEL_ID

  if (!token || !channelId) {
    throw new Error("Discord credentials not configured")
  }

  const mailtoSubject = encodeURIComponent(`Re: ${payload.project}`).replace(
    /%20/g,
    "+"
  )
  const mailtoBody = encodeURIComponent(
    `Hi ${payload.name},\n\nThanks for reaching out about "${payload.project}".\n\n`
  ).replace(/%20/g, "+")
  const mailtoLink = `mailto:${payload.email}?subject=${mailtoSubject}&body=${mailtoBody}`

  const rest = new REST({ version: "10" }).setToken(token)

  await rest.post(Routes.channelMessages(channelId), {
    body: {
      embeds: [
        {
          title: "New contact form submission",
          color: 0x023be6,
          timestamp: new Date().toISOString(),
          fields: [
            { name: "Name", value: payload.name, inline: true },
            { name: "Email", value: payload.email, inline: true },
            { name: "Project", value: payload.project },
            { name: "Message", value: payload.message },
            { name: "IP", value: ip, inline: true },
            { name: "Referer", value: referer, inline: true },
            {
              name: "User Agent",
              value:
                userAgent.length > 1024
                  ? userAgent.slice(0, 1021) + "…"
                  : userAgent,
            },
            { name: "Reply", value: `[Open mail draft](${mailtoLink})` },
          ],
        },
      ],
    },
  })

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: "Kenni <info@kennik.dk>",
      to: payload.email,
      subject: `Got your message about "${payload.project}"`,
      react: createElement(ContactConfirmationEmail, {
        name: payload.name,
        project: payload.project,
      }),
    })
  }
}
