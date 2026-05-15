"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"

interface DeleteButtonProps {
  action: () => Promise<void>
  label?: string
}

export function DeleteButton({ action, label = "Delete" }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!window.confirm("Delete this item? This cannot be undone.")) return
    startTransition(() => {
      action()
    })
  }

  return (
    <Button variant="destructive" size="xs" onClick={handleClick} disabled={isPending}>
      {isPending ? "…" : label}
    </Button>
  )
}
