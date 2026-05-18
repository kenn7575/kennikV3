export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      {children}
    </div>
  )
}
