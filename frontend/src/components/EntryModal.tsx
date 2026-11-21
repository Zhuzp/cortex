import { useState, useEffect } from 'react'
import type { Entry, EntryCreate } from '../types'

interface Props {
  entry?: Entry | null
  onSave: (data: EntryCreate) => Promise<void>
  onClose: () => void
}

const CATEGORIES = ['trade', 'en']

export default function EntryModal({ entry, onSave, onClose }: Props) {
  const [form, setForm] = useState<EntryCreate>({
    title: '', excerpt: '', content: '', source: '', category: 'trade', tags: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (entry) {
      setForm({ title: entry.title, excerpt: entry.excerpt, content: entry.content,
        source: entry.source, category: entry.category, tags: [...entry.tags] })
    }
  }, [entry])

  const set = (k: keyof EntryCreate, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags?.includes(t)) set('tags', [...(form.tags ?? []), t])
    setTagInput('')
  }
  const removeTag = (t: string) => set('tags', form.tags?.filter(x => x !== t))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">{entry ? '编辑条目' : '新建条目'}</h2>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Category */}
          <div className="flex gap-2">
            {CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => set('category', c)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  form.category === c ? 'border-trade text-trade bg-trade-bg' : 'border-border text-dim hover:border-muted'
                }`}>
                {c === 'trade' ? '交易思路' : 'English'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted font-mono uppercase tracking-wider">标题 *</label>
            <input required value={form.title} onChange={e => set('title', e.target.value)}
              className="bg-surface-hi border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-dim"
              placeholder="条目标题" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted font-mono uppercase tracking-wider">摘要 *</label>
            <textarea required rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
              className="bg-surface-hi border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-dim resize-none"
              placeholder="核心观点，一两句话" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted font-mono uppercase tracking-wider">来源</label>
            <input value={form.source} onChange={e => set('source', e.target.value)}
              className="bg-surface-hi border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-dim"
              placeholder="@Twitter / 文章名 / 播客" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted font-mono uppercase tracking-wider">正文（可选）</label>
            <textarea rows={5} value={form.content} onChange={e => set('content', e.target.value)}
              className="bg-surface-hi border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-dim resize-none"
              placeholder="完整笔记、原文引用等" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted font-mono uppercase tracking-wider">标签</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() }}}
                className="flex-1 bg-surface-hi border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-dim"
                placeholder="输入后按 Enter 添加" />
              <button type="button" onClick={addTag}
                className="px-3 py-2 bg-surface-hi border border-border rounded-lg text-sm text-dim hover:text-white transition-colors">
                +
              </button>
            </div>
            {(form.tags ?? []).length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-1">
                {form.tags!.map(t => (
                  <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-surface-hi border border-border text-dim">
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="hover:text-white">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-dim hover:text-white border border-border rounded-lg transition-colors">
              取消
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 text-sm font-medium bg-trade text-[#090c14] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
