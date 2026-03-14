'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  presetToday: boolean
  onClose: () => void
  onSave: (startDate: string) => Promise<void>
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function RegisterModal({ open, presetToday, onClose, onSave }: Props) {
  const [date, setDate] = useState(todayStr())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && presetToday) setDate(todayStr())
  }, [open, presetToday])

  async function handleSave() {
    if (!date) return
    setLoading(true)
    await onSave(date)
    setLoading(false)
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center px-6',
        'transition-all duration-300',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-sm bg-surface border border-border rounded-2xl p-8 transition-all duration-300',
          open ? 'translate-y-0' : 'translate-y-5'
        )}
      >
        <h2 className="font-serif text-2xl font-light mb-1">Registrar parche</h2>
        <p className="font-serif text-sm text-text-muted font-light mb-7">
          ¿Cuándo te pusiste el parche?
        </p>

        <div className="mb-6">
          <label className="block font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayStr()}
            className="w-full px-4 py-3 bg-surface2 border border-border rounded-xl text-text font-mono text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-3 bg-transparent border border-border rounded-xl font-serif text-base text-text-muted hover:border-text-muted hover:text-text transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !date}
            className="py-3 bg-gradient-to-br from-accent to-[#b8935a] text-bg font-serif text-base font-semibold rounded-xl hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {loading ? '...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
