'use client'

import type { ComputedCycle } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  computed: ComputedCycle
}

const weeks = [
  { num: 1, label: 'Parche 1', icon: '🩹', isRest: false },
  { num: 2, label: 'Parche 2', icon: '🩹', isRest: false },
  { num: 3, label: 'Parche 3', icon: '🩹', isRest: false },
  { num: 4, label: 'Descanso', icon: '🌸', isRest: true },
] as const

export function CycleTimeline({ computed }: Props) {
  const { currentWeek } = computed

  return (
    <div className="bg-surface border border-border rounded-2xl p-7">
      <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
        Ciclo de 4 semanas
      </p>
      <div className="flex gap-2.5">
        {weeks.map((week) => {
          const isActive = week.num === currentWeek
          const isPast = week.num < currentWeek

          return (
            <div
              key={week.num}
              className={cn(
                'flex-1 px-2 py-3 rounded-xl border text-center transition-all duration-500',
                isActive && !week.isRest && 'bg-accent-soft border-accent',
                isActive && week.isRest && 'bg-rose-soft border-rose-patch/60',
                isPast && 'opacity-40 border-border',
                !isActive && !isPast && 'border-border'
              )}
            >
              <p className="font-mono text-[8px] tracking-[0.2em] text-text-dim mb-1.5">
                SEM {week.num}
              </p>
              <p className="text-xl mb-1">{week.icon}</p>
              <p
                className={cn(
                  'font-serif text-[0.72rem] font-light',
                  isActive && !week.isRest && 'text-accent',
                  isActive && week.isRest && 'text-rose-patch',
                  !isActive && 'text-text-muted'
                )}
              >
                {week.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
