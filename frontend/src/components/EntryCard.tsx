import type { Entry } from '../types'

interface Props {
  entry: Entry
  onClick: () => void
}

const CAT_STYLES: Record<string, { accent: string; badge: string; bar: string }> = {
  trade: { accent: 'text-trade', badge: 'bg-trade-bg text-trade', bar: 'bg-trade' },
  en:    { accent: 'text-en',    badge: 'bg-en-bg text-en',       bar: 'bg-en'    },
}
function catStyle(cat: string) {
  return CAT_STYLES[cat] ?? { accent: 'text-dim', badge: 'bg-surface-hi text-dim', bar: 'bg-dim' }
}

export default function EntryCard({ entry, onClick }: Props) {
  const s = catStyle(entry.category)
  const dateStr = new Date(entry.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' })

  return (
    <article
      onClick={onClick}
      className="relative bg-surface border border-border rounded-xl p-5 flex flex-col gap-2.5 cursor-pointer hover:bg-surface-hi hover:border-muted transition-colors overflow-hidden"
    >
      {/* left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${s.bar}`} />

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`font-mono text-[11px] font-medium px-2 py-0.5 rounded ${s.badge}`}>
          {entry.category === 'trade' ? '交易' : entry.category === 'en' ? 'English' : entry.category}
        </span>
        {entry.source && (
          <span className="font-mono text-[11px] text-muted">{entry.source}</span>
        )}
        <span className="font-mono text-[11px] text-muted ml-auto">{dateStr}</span>
      </div>

      <h3 className="text-[15px] font-semibold leading-snug text-balance">{entry.title}</h3>
      <p className="text-[13.5px] text-dim leading-relaxed line-clamp-3">{entry.excerpt}</p>

      {entry.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-1">
          {entry.tags.map(t => (
            <span key={t} className="text-[11.5px] px-2 py-0.5 rounded bg-surface-hi text-muted border border-border">{t}</span>
          ))}
        </div>
      )}
    </article>
  )
}
