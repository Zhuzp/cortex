import { useState } from 'react'
import { aiApi } from '../api'
import type { AskResponse } from '../types'

interface Props {
  onHighlight: (ids: number[]) => void
}

export default function AskPanel({ onHighlight }: Props) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<AskResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    if (!question.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const r = await aiApi.ask(question)
      setResult(r)
      onHighlight(r.sources)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-trade text-[#090c14] font-medium text-sm rounded-full shadow-lg hover:opacity-90 transition-opacity"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="M11 8v3l2 2"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        AI 检索
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-[min(420px,calc(100vw-2rem))] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium">问知识库</span>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-white text-lg leading-none">×</button>
          </div>

          <div className="p-4 flex gap-2">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') ask() }}
              placeholder="问一个问题…"
              className="flex-1 bg-surface-hi border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted outline-none focus:border-dim"
            />
            <button onClick={ask} disabled={loading || !question.trim()}
              className="px-4 py-2 bg-trade text-[#090c14] text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity whitespace-nowrap">
              {loading ? '…' : '问'}
            </button>
          </div>

          {loading && (
            <div className="px-4 pb-4 text-sm text-muted animate-pulse">正在检索知识库…</div>
          )}

          {result && (
            <div className="px-4 pb-4 flex flex-col gap-3 max-h-72 overflow-y-auto">
              <div className="text-sm text-dim leading-relaxed whitespace-pre-wrap">{result.answer}</div>
              {result.sources.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] text-muted uppercase tracking-wider">引用</span>
                  {result.sources.map(id => (
                    <span key={id} className="font-mono text-[11px] px-1.5 py-0.5 bg-trade-bg text-trade rounded border border-border">#{id}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
