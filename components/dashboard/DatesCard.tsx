'use client'

import type { ComputedCycle } from '@/types'
import { formatDateAR } from '@/lib/cycle-utils'

interface Props {
  computed: ComputedCycle
}

export function DatesCard({ computed }: Props) {
  const dates = [
    { label: 'Pusiste el parche', date: computed.cycleStart, color: '#7abf9e', type: 'start' },
    { label: 'Cambio 1 (Sem. 2)',  date: computed.change1,   color: '#c9a96e', type: 'change' },
    { label: 'Cambio 2 (Sem. 3)',  date: computed.change2,   color: '#c9a96e', type: 'change' },
    { label: 'Retirás el parche',  date: computed.remove,    color: '#d4788a', type: 'remove' },
    { label: 'Nuevo ciclo',        date: computed.newCycle,  color: '#7abf9e', type: 'new' },
  ]

  return (
    <div className="bg-surface border border-border rounded-2xl p-7">
      <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
        Fechas del ciclo
      </p>
      <div className="space-y-2.5">
        {dates.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-4 py-3 bg-surface2 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
              <span className="font-serif text-[0.88rem] text-text-muted">{item.label}</span>
            </div>
            <span className="font-mono text-[0.82rem] text-text">
              {formatDateAR(item.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
