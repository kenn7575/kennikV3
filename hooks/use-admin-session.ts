"use client"

import { useSession } from "@/lib/auth-client"

export function useAdminSession() {
  const { data: session, isPending } = useSession()
  return {
    isAdmin: !!session?.user,
    isPending,
    user: session?.user ?? null,
  }
}
