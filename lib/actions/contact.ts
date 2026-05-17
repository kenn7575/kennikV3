"use server"

import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"
import { headers } from "next/headers"

type ContactPayload = {
  name: string
  email: string
  project: string
  message: string
}

export async function sendContactNotification(payload: ContactPayload) {
  const token = process.env.DISCORD_BOT_TOKEN
  const channelId = process.env.DISCORD_CHANNEL_ID

  if (!token || !channelId) {
    throw new Error("Discord credentials not configured")
  }

  const headersList = await headers()
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  const userAgent = headersList.get("user-agent") ?? "unknown"
  const referer = headersList.get("referer") ?? "direct"

  const mailtoSubject = encodeURIComponent(`Re: ${payload.project}`).replace(/%20/g, "+")
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
}
