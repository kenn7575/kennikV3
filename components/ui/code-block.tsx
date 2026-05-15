import { codeToHtml } from "shiki"

type CodeBlockProps = {
  code: string
  language: string
  caption?: string
}

export async function CodeBlock({ code, language, caption }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "vesper",
  })

  return (
    <div className="border border-[var(--cobalt-border)] rounded-[20px] overflow-hidden bg-[var(--ink-950)]">
      <div className="flex items-center gap-[14px] px-[18px] py-3 border-b border-[var(--cobalt-border-lo)] bg-white/[0.02] font-mono text-[11.5px] tracking-[0.12em] uppercase text-[var(--fg3)]">
        <span className="inline-flex gap-[6px]">
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--ink-600)] border border-[var(--cobalt-border-hi)]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--ink-600)] border border-[var(--cobalt-border-hi)]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--ink-600)] border border-[var(--cobalt-border-hi)]" />
        </span>
        <span>{language.toUpperCase()}</span>
        <span className="ml-auto text-[var(--cobalt-300)]">{language}</span>
      </div>
      <div
        className="overflow-x-auto [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!border-0 [&_pre]:!rounded-none [&_pre]:!p-[24px_26px] [&_pre]:font-mono [&_pre]:!text-[13.5px] [&_pre]:!leading-[1.7] [&_code]:!bg-transparent [&_code]:text-[1em]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption && (
        <div className="px-[22px] py-[14px] border-t border-[var(--cobalt-border-lo)] bg-white/[0.018] text-[14px] text-[var(--fg2)] leading-[1.5]">
          {caption}
        </div>
      )}
    </div>
  )
}
