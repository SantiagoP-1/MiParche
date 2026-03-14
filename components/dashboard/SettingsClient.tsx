'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { UserProfile } from '@/types'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

interface Props {
  profile: UserProfile | null
  user: { name?: string; picture?: string; email?: string }
}

const TIMEZONES = [
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (GMT-3)' },
  { value: 'America/Santiago',               label: 'Chile (GMT-4/-3)' },
  { value: 'America/Bogota',                 label: 'Colombia (GMT-5)' },
  { value: 'America/Lima',                   label: 'Perú (GMT-5)' },
  { value: 'America/Caracas',                label: 'Venezuela (GMT-4)' },
  { value: 'America/Mexico_City',            label: 'México (GMT-6/-5)' },
  { value: 'Europe/Madrid',                  label: 'España (GMT+1/+2)' },
  { value: 'UTC',                            label: 'UTC (GMT+0)' },
]

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function SettingsClient({ profile, user }: Props) {
  const [name, setName] = useState(profile?.name ?? user.name ?? '')
  const [notifHour, setNotifHour] = useState(profile?.notification_hour ?? 9)
  const [timezone, setTimezone] = useState(
    profile?.timezone ?? 'America/Argentina/Buenos_Aires'
  )
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const { theme, toggle } = useTheme()

  async function handleSave() {
    setSaveState('saving')
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, notification_hour: notifHour, timezone }),
      })
      if (!res.ok) throw new Error()
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 2500)
    }
  }

  const isDirty =
    name !== (profile?.name ?? user.name ?? '') ||
    notifHour !== (profile?.notification_hour ?? 9) ||
    timezone !== (profile?.timezone ?? 'America/Argentina/Buenos_Aires')

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
          <em className="italic text-accent">Ajustes</em>
        </h2>
        <p className="font-serif text-text-muted font-light mt-1">
          Personalizá tu experiencia
        </p>
      </div>

      {/* Profile card */}
      <div
        className="bg-surface border border-border rounded-2xl p-7 animate-fade-up"
        style={{ animationDelay: '0.05s' }}
      >
        <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
          Perfil
        </p>
        <div className="flex items-center gap-4 mb-6">
          {user.picture ? (
            <Image
              src={user.picture}
              alt="Avatar"
              width={48}
              height={48}
              className="rounded-full border border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-surface2 border border-border flex items-center justify-center">
              <span className="font-serif text-lg text-text-muted">
                {(name || user.email || '?')[0].toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-serif text-sm text-text">{user.email}</p>
            <p className="font-mono text-[9px] tracking-widest text-text-dim uppercase mt-0.5">
              Cuenta Auth0
            </p>
          </div>
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-4 py-3 bg-surface2 border border-border rounded-xl text-text font-serif text-base outline-none focus:border-accent transition-colors placeholder:text-text-dim"
          />
        </div>
      </div>

      {/* Theme card */}
      <div
        className="bg-surface border border-border rounded-2xl p-7 animate-fade-up"
        style={{ animationDelay: '0.08s' }}
      >
        <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
          Apariencia
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-base text-text">
              {theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
            </p>
            <p className="font-serif text-xs text-text-dim font-light mt-0.5">
              {theme === 'dark'
                ? 'Fondo negro con dorado'
                : 'Fondo blanco con dorado'}
            </p>
          </div>
          <button
            onClick={toggle}
            className={cn(
              'relative w-14 h-7 rounded-full border transition-all duration-300 flex-shrink-0',
              theme === 'light'
                ? 'bg-accent border-accent'
                : 'bg-surface2 border-border'
            )}
            aria-label="Toggle theme"
          >
            <span
              className={cn(
                'absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-sm',
                theme === 'light'
                  ? 'left-7 bg-white shadow-md'
                  : 'left-0.5 bg-surface border border-border'
              )}
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </span>
          </button>
        </div>
      </div>

      {/* Notifications card */}
      <div
        className="bg-surface border border-border rounded-2xl p-7 animate-fade-up"
        style={{ animationDelay: '0.1s' }}
      >
        <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
          Notificaciones
        </p>
        <div className="mb-5">
          <label className="block font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase mb-2">
            Hora del recordatorio
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {[7, 8, 9, 10, 11, 12, 13, 14, 18, 20, 21, 22].map((h) => (
              <button
                key={h}
                onClick={() => setNotifHour(h)}
                className={cn(
                  'py-2.5 rounded-xl border font-mono text-[11px] transition-all duration-200',
                  notifHour === h
                    ? 'bg-accent-soft border-accent text-accent'
                    : 'bg-surface2 border-border text-text-muted hover:border-accent/50 hover:text-text'
                )}
              >
                {String(h).padStart(2, '0')}:00
              </button>
            ))}
          </div>
          <p className="font-serif text-xs text-text-dim font-light mt-2">
            Recibirás el recordatorio a las{' '}
            <span className="text-accent">{String(notifHour).padStart(2, '0')}:00</span>{' '}
            el día que toque cambiar el parche.
          </p>
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase mb-2">
            Zona horaria
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-3 bg-surface2 border border-border rounded-xl text-text font-serif text-base outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
            style={{ colorScheme: theme === 'light' ? 'light' : 'dark' }}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save button */}
      <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
        <button
          onClick={handleSave}
          disabled={!isDirty || saveState === 'saving'}
          className={cn(
            'w-full py-4 rounded-xl font-serif text-lg font-semibold transition-all duration-300',
            isDirty && saveState === 'idle'
              ? 'bg-gradient-to-br from-accent to-[#b8935a] text-bg hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,110,0.3)]'
              : saveState === 'saved'
              ? 'bg-green-soft border border-green-patch/30 text-green-patch'
              : saveState === 'error'
              ? 'bg-rose-soft border border-rose-patch/30 text-rose-patch'
              : 'bg-surface2 border border-border text-text-dim cursor-not-allowed'
          )}
        >
          {saveState === 'saving' && 'Guardando...'}
          {saveState === 'saved'  && '✓ Guardado'}
          {saveState === 'error'  && '✗ Error al guardar'}
          {saveState === 'idle'   && (isDirty ? 'Guardar cambios' : 'Sin cambios')}
        </button>
      </div>

      {/* Sesión */}
      <div
        className="bg-surface border border-border rounded-2xl p-7 animate-fade-up"
        style={{ animationDelay: '0.2s' }}
      >
        <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
          Sesión
        </p>
        <a
          href="/api/auth/logout"
          className="w-full flex items-center justify-center py-3 border border-border rounded-xl font-mono text-[11px] tracking-[0.2em] text-text-muted uppercase hover:border-rose-patch hover:text-rose-patch transition-all duration-200"
        >
          Cerrar sesión
        </a>
      </div>
    </div>
  )
}
