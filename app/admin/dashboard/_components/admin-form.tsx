"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { errorStyle } from "@/app/admin/_styles"

interface AdminFormProps {
  action: (state: { error: string } | null, fd: FormData) => Promise<{ error: string } | null>
  cancelHref: string
  children: React.ReactNode
  submitLabel?: string
}

export function AdminForm({ action, cancelHref, children, submitLabel = "Save" }: AdminFormProps) {
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction}>
      {state?.error && <div style={errorStyle}>{state.error}</div>}
      {children}
      <div
        style={{
          display: "flex",
          gap: 12,
          paddingTop: 24,
          marginTop: 8,
          borderTop: "1px solid var(--cobalt-border)",
        }}
      >
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : submitLabel}
        </Button>
        <Button variant="ghost" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
