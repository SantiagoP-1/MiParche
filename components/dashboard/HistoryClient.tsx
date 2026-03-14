'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PatchCycle, ComputedCycle } from '@/types'
import { formatDateAR, getCycleDates, getCurrentCycleStart } from '@/lib/cycle-utils'
import { cn } from '@/lib/utils'

interface HistoryEntry {
  cycle: PatchCycle
  computed: ComputedCycle | null
  durationDays: number
  cycleNumber: number
}

interface Props {
  entries: HistoryEntry[]
}

const STATUS_CONFIG = {
  active:    { label: 'Activo',     cls: 'bg-green-soft text-green-patch border-green-patch/30' },
  completed: { label: 'Completado', cls: 'bg-accent-soft text-accent border-accent/30' },
  abandoned: { label: 'Abandonado', cls: 'bg-rose-soft text-rose-patch border-rose-patch/30' },
}

export function HistoryClient({ entries: initialEntries }: Props) {
  const [entries, setEntries] = useState(initialEntries)
  const [clearing, setClearing] = useState(false)

  const totalCycles     = entries.length
  const completedCycles = entries.filter(e => e.cycle.status === 'completed').length

  async function handleDeleteOne(id: string) {
    if (!confirm('¿Borrar este ciclo del historial?')) return
    const res = await fetch(`/api/cycles/${id}`, { method: 'DELETE' })
    if (res.ok) setEntries(prev => prev.filter(e => e.cycle.id !== id))
  }

  async function handleClearAll() {
    if (!confirm('¿Borrar TODO el historial? Esta acción no se puede deshacer.')) return
    setClearing(true)
    const res = await fetch('/api/cycles/clear', { method: 'DELETE' })
    if (res.ok) setEntries([])
    setClearing(false)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="animate-fade-up">
        <Link
          href="/dashboard"
          className="font-mono text-[10px] tracking-[0.25em] text-text-dim uppercase hover:text-accent transition-colors"
        >
          ← Dashboard
        </Link>
        <h2 className="font-serif text-3xl font-light mt-3">
          Historial de <em className="italic text-accent">ciclos</em>
        </h2>
        <p className="font-serif text-text-muted font-light mt-1">
          Todos tus ciclos registrados
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        {[
          { label: 'Total',            value: totalCycles },
          { label: 'Completados',      value: completedCycles },
          { label: 'Días registrados', value: totalCycles * 28 },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-2xl p-5 text-center">
            <p className="font-serif font-light leading-none text-accent" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)' }}>
              {stat.value}
            </p>
            <p className="font-mono text-[9px] tracking-[0.2em] text-text-dim uppercase mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-4xl mb-4">🩹</p>
          <p className="font-serif text-lg text-text-muted font-light">
            Todavía no registraste ningún ciclo
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-5 px-6 py-3 bg-gradient-to-br from-accent to-[#b8935a] text-bg font-serif font-semibold rounded-xl text-sm hover:-translate-y-0.5 transition-all duration-300"
          >
            Registrar primer ciclo
          </Link>
        </div>
      )}

      {/* Cycles list */}
      {entries.length > 0 && (
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase">
              Ciclos ({entries.length})
            </p>
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="font-mono text-[9px] tracking-[0.15em] text-text-dim uppercase hover:text-rose-patch transition-colors disabled:opacity-50"
            >
              {clearing ? 'Borrando...' : '🗑 Limpiar todo'}
            </button>
          </div>

          {entries.map((entry, i) => (
            <CycleCard
              key={entry.cycle.id}
              entry={entry}
              index={i}
              onDelete={handleDeleteOne}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CycleCard({
  entry,
  index,
  onDelete,
}: {
  entry: HistoryEntry
  index: number
  onDelete: (id: string) => void
}) {
  const { cycle, computed, durationDays } = entry
  const status = STATUS_CONFIG[cycle.status]
  const startDate = new Date(cycle.start_date)
  const cycleStart = getCurrentCycleStart(startDate)
  const dates = getCycleDates(cycleStart)
  const isActive = cycle.status === 'active'
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300">
      {/* Card header */}
      <div className="flex items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 px-6 py-5 flex items-center justify-between hover:bg-surface2 transition-colors duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface2 border border-border flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-[11px] text-text-muted">#{index + 1}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('inline-block px-2.5 py-0.5 rounded-full border font-mono text-[9px] tracking-[0.15em] uppercase', status.cls)}>
                  {status.label}
                </span>
                {isActive && computed && (
                  <span className="font-mono text-[9px] text-text-dim">Sem. {computed.currentWeek}</span>
                )}
              </div>
              <p className="font-serif text-[0.95rem] text-text">
                Inicio: <span className="text-accent">{formatDateAR(startDate)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-mono text-[10px] text-text-dim">{isActive ? 'Día' : 'Duración'}</p>
              <p className="font-serif text-lg text-text-muted font-light">{durationDays}<span className="text-sm"> días</span></p>
            </div>
            <ChevronIcon expanded={expanded} />
          </div>
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(cycle.id)}
          className="px-4 py-5 text-text-dim hover:text-rose-patch transition-colors duration-200 hover:bg-rose-soft"
          title="Borrar ciclo"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Expanded dates */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="pt-5 space-y-2.5">
            {[
              { label: 'Inicio del ciclo',  date: dates.put,      color: '#7abf9e' },
              { label: 'Cambio 1 (Sem. 2)', date: dates.change1,  color: '#c9a96e' },
              { label: 'Cambio 2 (Sem. 3)', date: dates.change2,  color: '#c9a96e' },
              { label: 'Retiro del parche', date: dates.remove,   color: '#d4788a' },
              { label: 'Fin del ciclo',     date: dates.newCycle, color: '#7abf9e' },
            ].map((item) => {
              const isPast  = item.date < new Date()
              const isToday = formatDateAR(item.date) === formatDateAR(new Date())
              return (
                <div
                  key={item.label}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl border',
                    isToday  ? 'bg-accent-soft border-accent/40' : 'bg-surface2 border-border',
                    isPast && !isToday && 'opacity-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="font-serif text-[0.85rem] text-text-muted">{item.label}</span>
                    {isToday && <span className="font-mono text-[8px] tracking-widest text-accent uppercase">hoy</span>}
                  </div>
                  <span className="font-mono text-[0.8rem] text-text">{formatDateAR(item.date)}</span>
                </div>
              )
            })}
          </div>
          {cycle.notes && (
            <div className="mt-4 p-4 bg-surface2 rounded-xl border border-border">
              <p className="font-mono text-[9px] tracking-[0.2em] text-text-dim uppercase mb-1">Nota</p>
              <p className="font-serif text-sm text-text-muted font-light">{cycle.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      className={cn('text-text-dim transition-transform duration-300', expanded && 'rotate-180')}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5 2h5M2 4h11M10 4l-.5 7h-4L5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
