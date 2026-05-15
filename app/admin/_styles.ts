import type { CSSProperties } from "react"

export const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--fg3)",
  marginBottom: 6,
}

export const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "var(--surface, #0a0a0a)",
  border: "1px solid var(--cobalt-border)",
  borderRadius: 8,
  color: "var(--fg1)",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
}

export const formRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 20,
}

export const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
}

export const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--fg3)",
  borderBottom: "1px solid var(--cobalt-border)",
}

export const tdStyle: CSSProperties = {
  padding: "12px 12px",
  borderBottom: "1px solid var(--cobalt-border-lo, var(--cobalt-border))",
  color: "var(--fg1)",
  verticalAlign: "middle",
}

export const errorStyle: CSSProperties = {
  padding: "12px 16px",
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.3)",
  borderRadius: 8,
  color: "#f87171",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  marginBottom: 20,
}

export const hintStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "var(--fg3)",
  marginTop: 4,
}
