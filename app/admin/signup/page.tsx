"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { checkNeedsSetup } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

const fieldStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 15,
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid var(--cobalt-border)",
  background: "var(--surface)",
  color: "var(--fg1)",
  outline: "none",
  width: "100%",
  transition: "border-color var(--d-base) var(--ease-out), box-shadow var(--d-base)",
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "var(--fg3)",
  display: "block",
  marginBottom: 8,
}

export default function AdminSignup() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkNeedsSetup().then((needsSetup) => {
      if (!needsSetup) router.replace("/admin/login")
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/admin/dashboard",
    })

    if (error) {
      setError(error.message ?? "Signup failed.")
      setLoading(false)
    } else {
      router.push("/admin/dashboard")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Logo />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--fg3)",
              marginTop: 12,
            }}
          >
            Create admin account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div>
            <label style={labelStyle} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={fieldStyle}
            />
          </div>

          {error && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--danger, #f87171)",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  )
}
