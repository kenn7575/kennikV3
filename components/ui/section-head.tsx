import { cn } from "@/lib/utils"
import { Eyebrow } from "@/components/ui/eyebrow"

type SectionHeadProps = {
  eyebrow: string
  title: React.ReactNode
  description?: string
  row?: boolean
  className?: string
}

export function SectionHead({ eyebrow, title, description, row = false, className }: SectionHeadProps) {
  if (row) {
    return (
      <div className={cn("flex justify-between items-end gap-8 flex-wrap mb-14", className)}>
        <div className="flex flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-0" style={{ marginTop: 18 }}>{title}</h2>
        </div>
        {description && (
          <p className="text-[--fg2] text-[17px] leading-[1.55] max-w-[580px] m-0">
            {description}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4 mb-14", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{ marginTop: 12 }}>{title}</h2>
      {description && (
        <p className="text-[--fg2] text-[17px] leading-[1.55] max-w-[580px] m-0">
          {description}
        </p>
      )}
    </div>
  )
}
