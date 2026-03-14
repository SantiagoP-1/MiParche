'use client'

import type { PatchCycle, ComputedCycle } from '@/types'
import { formatDateFullAR } from '@/lib/cycle-utils'
import { cn } from '@/lib/utils'

interface Props {
  cycle: PatchCycle | null
  computed: ComputedCycle | null
}

export function StatusCard({ cycle, computed }: Props) {
  if (!cycle || !computed) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-7">
        <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
          Estado actual
        </p>
        <div className="text-center py-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-surface2 border border-border font-mono text-[11px] tracking-[0.2em] text-text-muted uppercase mb-5">
            Sin registrar
          </span>
          <p className="font-serif text-[5rem] font-light leading-none text-text-dim">—</p>
          <p className="font-serif text-text-muted mt-2 font-light">
            Registrá tu parche para comenzar
          </p>
        </div>
      </div>
    )
  }

  const { isRestWeek, daysUntilNextEvent, nextEvent, currentWeek } = computed

  const badgeConfig = {
    active: { label: `Parche ${currentWeek} activo`, cls: 'bg-green-soft text-green-patch border border-green-patch/30' },
    warning: { label: currentWeek < 3 ? '¡Cambiar mañana!' : '¡Retirar mañana!', cls: 'bg-accent-soft text-accent border border-accent/35' },
    rest: { label: 'Semana de descanso', cls: 'bg-rose-soft text-rose-patch border border-rose-patch/30' },
  }

  const badgeKey = isRestWeek ? 'rest' : daysUntilNextEvent <= 1 ? 'warning' : 'active'
  const badge = badgeConfig[badgeKey]

  return (
    <div className="bg-surface border border-border rounded-2xl p-7">
      <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
        Estado actual
      </p>
      <div className="text-center">
        <span
          className={cn(
            'inline-block px-4 py-1.5 rounded-full font-mono text-[11px] tracking-[0.2em] uppercase mb-5',
            badge.cls
          )}
        >
          {badge.label}
        </span>

        <p
          className="font-serif font-light leading-none"
          style={{
            fontSize: 'clamp(3.5rem, 14vw, 5.5rem)',
            color: isRestWeek ? '#d4788a' : '#c9a96e',
          }}
        >
          {daysUntilNextEvent === 0 ? '¡Hoy!' : daysUntilNextEvent}
        </p>

        <p className="font-serif text-text-muted mt-2 font-light">
          {daysUntilNextEvent === 0
            ? nextEvent.label
            : daysUntilNextEvent === 1
            ? 'día para el próximo evento'
            : 'días para el próximo evento'}
        </p>

        <div className="mt-5 p-4 bg-surface2 rounded-xl border border-border text-sm">
          Próximo evento:{' '}
          <strong className="text-accent font-semibold">
            {nextEvent.label} — {formatDateFullAR(nextEvent.date)}
          </strong>
        </div>
      </div>
    </div>
  )
}
