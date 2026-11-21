interface Props {
  value: string
  onChange: (v: string) => void
  activeCategory: string
  onCategoryChange: (c: string) => void
}

const CATEGORIES = [
  { key: 'all',   label: 'All' },
  { key: 'trade', label: '交易思路' },
  { key: 'en',    label: 'English' },
]

export default function Header({ value, onChange, activeCategory, onCategoryChange }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-[#090c14] border-b border-border px-5 py-3">
      <div className="max-w-6xl mx-auto flex items-center gap-5 flex-wrap">
        <div className="font-display text-xl tracking-tight whitespace-nowrap">
          Cortex<span className="text-trade">.</span>
        </div>

        <nav className="flex gap-1">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => onCategoryChange(c.key)}
              className={`text-sm font-medium px-3 py-1.5 rounded-md border transition-colors ${
                activeCategory === c.key
                  ? 'border-border bg-surface-hi text-white'
                  : 'border-transparent text-dim hover:text-white hover:bg-surface-hi'
              }`}
            >
              {c.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Search…"
            className="bg-surface-hi border border-border text-sm text-white placeholder-muted rounded-md pl-8 pr-3 py-1.5 w-44 focus:w-56 focus:border-dim outline-none transition-all"
          />
        </div>
      </div>
    </header>
  )
}
