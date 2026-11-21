import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import EntryCard from './components/EntryCard'
import EntryModal from './components/EntryModal'
import AskPanel from './components/AskPanel'
import { entriesApi } from './api'
import type { Entry, EntryCreate } from './types'

const SECTION = {
  trade: { label: '交易思路', color: 'text-trade' },
  en:    { label: 'English', color: 'text-en' },
} as const

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Entry | null>(null)
  const [highlightIds, setHighlightIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await entriesApi.list({ category: category === 'all' ? undefined : category, q: search || undefined })
      setEntries(data)
    } finally {
      setLoading(false)
    }
  }, [category, search])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (e: Entry) => { setEditing(e); setModalOpen(true) }

  const save = async (data: EntryCreate) => {
    if (editing) {
      await entriesApi.update(editing.id, data)
    } else {
      await entriesApi.create(data)
    }
    setModalOpen(false)
    setEditing(null)
    await load()
  }

  const remove = async (e: Entry) => {
    if (!confirm(`删除「${e.title}」？`)) return
    await entriesApi.remove(e.id)
    await load()
  }

  const groups = (['trade', 'en'] as const).filter(c => category === 'all' || category === c)

  return (
    <div className="min-h-screen">
      <Header value={search} onChange={setSearch} activeCategory={category} onCategoryChange={setCategory} />

      <main className="max-w-6xl mx-auto px-5 py-9">
        {/* New entry button */}
        <div className="flex justify-end mb-6">
          <button onClick={openNew}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-white hover:bg-surface-hi hover:border-muted transition-colors flex items-center gap-1.5">
            <span className="text-base leading-none">+</span> 新建条目
          </button>
        </div>

        {loading ? (
          <div className="text-center text-muted py-20 text-sm">加载中…</div>
        ) : entries.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl py-16 px-6 text-center text-muted text-sm">
            还没有条目。点右上角「新建条目」添加第一条吧。
          </div>
        ) : (
          groups.map(cat => {
            const items = entries.filter(e => e.category === cat)
            if (items.length === 0) return null
            return (
              <section key={cat} className="mb-12">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-mono text-[11px] font-medium tracking-[0.12em] uppercase opacity-50">{cat}</span>
                  <h2 className={`font-display text-2xl ${SECTION[cat].color}`}>{SECTION[cat].label}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(e => (
                    <div key={e.id} className="flex flex-col gap-1">
                      <EntryCard entry={e} onClick={() => openEdit(e)} />
                      {highlightIds.includes(e.id) && (
                        <div className="font-mono text-[10px] text-trade px-1">★ AI 引用</div>
                      )}
                      <button onClick={() => remove(e)} className="self-start text-[11px] text-muted hover:text-red-400 transition-colors px-1">
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )
          })
        )}
      </main>

      <footer className="border-t border-border text-center py-6 font-mono text-xs text-muted">
        Cortex · Personal Knowledge Base
      </footer>

      {modalOpen && (
        <EntryModal entry={editing} onSave={save} onClose={() => { setModalOpen(false); setEditing(null) }} />
      )}

      <AskPanel onHighlight={setHighlightIds} />
    </div>
  )
}
