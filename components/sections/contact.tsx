"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Globe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Tag } from "@/components/ui/tag"
import { SectionHead } from "@/components/ui/section-head"
import { sendContactNotification } from "@/lib/actions/contact"

const fieldStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 15,
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid var(--cobalt-border)",
  background: "var(--surface)",
  color: "var(--fg1)",
  outline: "none",
  width: "100%",
  transition:
    "border-color var(--d-base) var(--ease-out), box-shadow var(--d-base)",
}

const labelStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  color: "var(--fg3)",
  display: "block",
  marginBottom: 8,
}

type FormState = {
  name: string
  email: string
  project: string
  message: string
}

export function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    project: "",
    message: "",
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await sendContactNotification(form)
      setSent(true)
    } catch {
      setError("Something went wrong — try emailing me directly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="CONTACT — START SOMETHING"
          title={
            <>
              Drop a line — I read{" "}
              <em style={{ fontStyle: "italic", color: "var(--fg2)" }}>
                every email.
              </em>
            </>
          }
        />

        <div className="grid gap-16" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {sent ? (
            <div
              className="flex flex-col gap-3"
              style={{
                border: "1px solid var(--cobalt-500)",
                background: "rgba(2,59,230,0.08)",
                borderRadius: 18,
                padding: 28,
                boxShadow: "var(--glow-cobalt-soft)",
              }}
            >
              <Eyebrow>SENT</Eyebrow>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "var(--fg1)",
                }}
              >
                Got it — I&apos;ll reply{" "}
                <em style={{ fontStyle: "italic", color: "var(--cobalt-300)" }}>
                  within a day.
                </em>
              </div>
              <p style={{ color: "var(--fg2)", margin: 0 }}>
                In the meantime, if you want to share more — a brief, a repo, a
                stack-trace — just reply to the confirmation.
              </p>
              <div>
                <Button
                  variant="outline"
                  className="rounded-full border-[--cobalt-border-hi] bg-transparent text-[--fg1] hover:bg-white/5"
                  onClick={() => {
                    setSent(false)
                    setForm({ name: "", email: "", project: "", message: "" })
                  }}
                >
                  Send another
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label style={labelStyle}>NAME</label>
                  <input
                    name="name"
                    style={fieldStyle}
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input
                    type="email"
                    style={fieldStyle}
                    value={form.email}
                    onChange={set("email")}
                    placeholder="hi@yourcompany.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>PROJECT (1 LINE)</label>
                <input
                  style={fieldStyle}
                  value={form.project}
                  onChange={set("project")}
                  placeholder="e.g. fix our slow checkout"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>MESSAGE</label>
                <textarea
                  rows={5}
                  style={{ ...fieldStyle, resize: "none" }}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Brief, repo, deadline — whatever helps."
                  required
                />
              </div>
              {error && (
                <p style={{ color: "var(--fg2)", fontSize: 13, margin: 0 }}>
                  {error}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <Tag>EXPECTED REPLY · &lt; 24H</Tag>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-full"
                  style={{
                    boxShadow: "var(--glow-cobalt-soft)",
                  }}
                >
                  {loading ? "Sending…" : "Send it"}
                  <ArrowUpRight size={16} />
                </Button>
              </div>
            </form>
          )}

          <aside className="flex flex-col gap-7">
            {[
              {
                label: "EMAIL",
                content: (
                  <a
                    href="mailto:info@kennik.dk"
                    style={{ fontSize: 18, color: "var(--fg1)" }}
                  >
                    info@kennik.dk
                  </a>
                ),
              },
              {
                label: "SOCIAL",
                content: (
                  <div className="flex flex-wrap gap-5">
                    {[
                      {
                        icon: (
                          <img
                            className="h-5 w-5"
                            src="/GitHub_Invertocat_White.svg"
                            alt="GitHub"
                          />
                        ),
                        label: "github",
                        href: "https://github.com/kenn7575",
                      },
                      {
                        icon: (
                          <img
                            className="h-5 w-5"
                            src="/InBug-White.png"
                            alt="LinkedIn"
                          />
                        ),
                        label: "linkedin",
                        href: "https://www.linkedin.com/in/kenni-kollemorten/",
                      },
                    ].map(({ icon, label, href }) => (
                      <a
                        target="_blank"
                        key={label}
                        href={href}
                        className="inline-flex items-center gap-2"
                        style={{ color: "var(--fg1)" }}
                      >
                        {icon} {label}
                      </a>
                    ))}
                  </div>
                ),
              },
            ].map(({ label, content }) => (
              <div
                key={label}
                className="flex flex-col gap-1.5 pb-5"
                style={{ borderBottom: "1px dashed var(--cobalt-border)" }}
              >
                <Eyebrow>{label}</Eyebrow>
                {content}
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  )
}
