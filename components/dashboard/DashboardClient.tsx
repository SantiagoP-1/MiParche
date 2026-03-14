'use client'

import { useState } from 'react'
import type { PatchCycle, ComputedCycle, UserProfile } from '@/types'
import { StatusCard } from './StatusCard'
import { CycleTimeline } from './CycleTimeline'
import { DatesCard } from './DatesCard'
import { RegisterModal } from './RegisterModal'
import { NotificationsCard } from './NotificationsCard'

interface Props {
  user: { name?: string; picture?: string; email?: string }
  profile: UserProfile | null
  cycle: PatchCycle | null
  computed: ComputedCycle | null
}

export function DashboardClient({ user, cycle, computed: initialComputed }: Props) {
  const [currentCycle, setCurrentCycle] = useState<PatchCycle | null>(cycle)
  const [computed, setComputed] = useState<ComputedCycle | null>(initialComputed)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPresetToday, setModalPresetToday] = useState(true)

  function openModalToday() { setModalPresetToday(true); setModalOpen(true) }
  function openModalManual() { setModalPresetToday(false); setModalOpen(true) }

  async function handleSaveCycle(startDate: string) {
    const res = await fetch('/api/cycles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_date: startDate }),
    })
    const json = await res.json()
    if (json.data) {
      const { computeCycle } = await import('@/lib/cycle-utils')
      setCurrentCycle(json.data)
      setComputed(computeCycle(json.data))
    }
    setModalOpen(false)
  }

  async function handleReset() {
    if (!confirm('¿Segura que querés reiniciar el registro?')) return
    await fetch('/api/cycles', { method: 'DELETE' })
    setCurrentCycle(null)
    setComputed(null)
  }

  const firstName = user.name?.split(' ')[0] ?? 'ahí'

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="animate-fade-up">
        <p className="font-mono text-[10px] tracking-[0.3em] text-text-dim uppercase mb-1">
          Bienvenida de vuelta
        </p>
        <h2 className="font-serif text-3xl font-light">
          Hola, <em className="italic text-accent">{firstName}</em>
        </h2>
      </div>

      {/* Status */}
      <div style={{ animationDelay: '0.05s' }} className="animate-fade-up">
        <StatusCard cycle={currentCycle} computed={computed} />
      </div>

      {/* Register */}
      <div
        className="bg-surface border border-border rounded-2xl p-7 animate-fade-up"
        style={{ animationDelay: '0.1s' }}
      >
        <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-4">
          Registro
        </p>
        <button
          onClick={openModalToday}
          className="w-full py-4 bg-gradient-to-br from-accent to-[#b8935a] text-bg font-serif text-lg font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,110,0.3)] transition-all duration-300"
        >
          ✦ Me puse el parche hoy
        </button>
        <button
          onClick={openModalManual}
          className="w-full mt-3 py-3 bg-transparent border border-border rounded-xl font-mono text-[11px] tracking-[0.2em] text-text-muted uppercase hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-300"
        >
          Registrar fecha anterior
        </button>
        {currentCycle && (
          <>
            <div className="h-px bg-border my-4" />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="font-mono text-[10px] tracking-[0.15em] text-text-dim uppercase underline underline-offset-4 hover:text-rose-patch transition-colors"
              >
                Reiniciar registro
              </button>
            </div>
          </>
        )}
      </div>

      {/* Cycle timeline */}
      {computed && (
        <div style={{ animationDelay: '0.15s' }} className="animate-fade-up">
          <CycleTimeline computed={computed} />
        </div>
      )}

      {/* Dates */}
      {computed && (
        <div style={{ animationDelay: '0.2s' }} className="animate-fade-up">
          <DatesCard computed={computed} />
        </div>
      )}

      {/* Notifications */}
      <div style={{ animationDelay: '0.25s' }} className="animate-fade-up">
        <NotificationsCard computed={computed} />
      </div>

      {/* Modal */}
      <RegisterModal
        open={modalOpen}
        presetToday={modalPresetToday}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCycle}
      />
    </div>
  )
}
