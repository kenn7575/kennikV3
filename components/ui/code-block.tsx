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
    <div className="border border-(--cobalt-border) rounded-[20px] overflow-hidden bg-(--ink-950)">
      <div className="flex items-center gap-3.5 px-4.5 py-3 border-b border-(--cobalt-border-lo) bg-white/2 font-mono text-[11.5px] tracking-[0.12em] uppercase text-(--fg3)">
        <span className="inline-flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-(--ink-600) border border-(--cobalt-border-hi)" />
          <span className="w-2.5 h-2.5 rounded-full bg-(--ink-600) border border-(--cobalt-border-hi)" />
          <span className="w-2.5 h-2.5 rounded-full bg-(--ink-600) border border-(--cobalt-border-hi)" />
        </span>
        <span>{language.toUpperCase()}</span>
        <span className="ml-auto text-(--cobalt-300)">{language}</span>
      </div>
      <div
        className="overflow-x-auto [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:border-0! [&_pre]:rounded-none! [&_pre]:p-[24px_26px]! [&_pre]:font-mono [&_pre]:text-[13.5px]! [&_pre]:leading-[1.7]! [&_code]:bg-transparent! [&_code]:text-[1em]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption && (
        <div className="px-5.5 py-3.5 border-t border-(--cobalt-border-lo) bg-white/[0.018] text-[14px] text-(--fg2) leading-normal">
          {caption}
        </div>
      )}
    </div>
  )
}
