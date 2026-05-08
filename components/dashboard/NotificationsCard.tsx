'use client'

import { useState, useEffect } from 'react'
import type { ComputedCycle } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  computed: ComputedCycle | null
}

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

export function NotificationsCard({ computed }: Props) {
  const [permission, setPermission] = useState<PermissionState>('default')
  const [enabled, setEnabled] = useState(false)
  const [swReady, setSwReady] = useState(false)

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported')
      return
    }
    setPermission(Notification.permission as PermissionState)
    setEnabled(Notification.permission === 'granted')

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => setSwReady(true))
        .catch((err) => console.error('[SW] Registration failed:', err))
    }
  }, [])

  async function toggleNotifications() {
    if (!('Notification' in window)) return

    if (!enabled) {
      const result = await Notification.requestPermission()
      setPermission(result as PermissionState)
      if (result === 'granted') {
        setEnabled(true)
        await scheduleNotifications()
        const reg = swReady ? await navigator.serviceWorker.ready : null
        if (reg) {
          reg.showNotification('Mi Parche ♡', {
            body: '✦ Recordatorios activados. Te avisaremos cuando toque cambiar el parche.',
            icon: '/icon-192.png',
            tag: 'miparche-welcome',
          })
        } else {
          new Notification('Mi Parche ♡', { body: '✦ Recordatorios activados.' })
        }
      }
    } else {
      setEnabled(false)
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready
        const notifications = await reg.getNotifications()
        notifications.forEach((n) => n.close())
      }
    }
  }

  async function scheduleNotifications() {
    if (!computed || Notification.permission !== 'granted') return

    const now = new Date()
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

    const events = [
      { date: computed.change1,  msg: '🩹 ¡Hoy toca cambiar el parche! Es la semana 2.' },
      { date: computed.change2,  msg: '🩹 ¡Hoy toca cambiar el parche! Es la semana 3.' },
      { date: computed.remove,   msg: '🌸 ¡Hoy retirás el parche! Empieza la semana de descanso.' },
      { date: computed.newCycle, msg: '✨ ¡Nuevo ciclo! Ponete el parche nuevo hoy.' },
    ]

    const schedule = events.map(({ date, msg }) => ({
      timestamp: new Date(date).setHours(9, 0, 0, 0),
      msg,
    }))
    localStorage.setItem('miparche_notif_schedule', JSON.stringify(schedule))

    for (const { date, msg } of events) {
      const notifTime = new Date(date)
      notifTime.setHours(9, 0, 0, 0)
      const delay = notifTime.getTime() - now.getTime()

      if (delay > 0 && delay <= TWENTY_FOUR_HOURS) {
        setTimeout(async () => {
          if (Notification.permission !== 'granted') return
          if (swReady) {
            const reg = await navigator.serviceWorker.ready
            reg.showNotification('Mi Parche ♡', {
              body: msg,
              icon: '/icon-192.png',
              tag: 'miparche-reminder',
              renotify: true,
            } as NotificationOptions & { renotify: boolean })
          } else {
            new Notification('Mi Parche ♡', { body: msg })
          }
        }, delay)
      }
    }
  }

  const statusConfig: Record<PermissionState, { text: string; cls: string }> = {
    granted:     { text: '✓ NOTIFICACIONES ACTIVADAS',                     cls: 'bg-green-soft text-green-patch' },
    denied:      { text: '✗ PERMISO DENEGADO · Revisá la configuración',   cls: 'bg-rose-soft text-rose-patch' },
    default:     { text: 'NOTIFICACIONES DESACTIVADAS',                    cls: 'bg-surface2 text-text-dim' },
    unsupported: { text: 'TU NAVEGADOR NO SOPORTA NOTIFICACIONES',         cls: 'bg-surface2 text-text-dim' },
  }

  const status = enabled && permission === 'granted' ? statusConfig.granted : statusConfig[permission]

  return (
    <div className="bg-surface border border-border rounded-2xl p-7">
      <p className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase mb-5">
        Notificaciones
      </p>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-base font-normal text-text">Recordatorios automáticos</h3>
          <p className="font-serif text-sm text-text-muted font-light mt-0.5">
            Te avisamos el día exacto del cambio y retiro
          </p>
        </div>

        <label
          className={cn(
            'relative w-11 h-6 flex-shrink-0',
            permission === 'unsupported' || permission === 'denied'
              ? 'opacity-40 cursor-not-allowed'
              : 'cursor-pointer'
          )}
        >
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleNotifications}
            disabled={permission === 'unsupported' || permission === 'denied'}
            className="sr-only"
          />
          <div className={cn(
            'w-full h-full rounded-full border transition-all duration-300',
            enabled ? 'bg-accent-soft border-accent' : 'bg-surface2 border-border'
          )} />
          <div className={cn(
            'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-300',
            enabled ? 'translate-x-[22px] bg-accent' : 'translate-x-[3px] bg-text-dim'
          )} />
        </label>
      </div>

      <div className={cn('mt-4 px-3 py-2 rounded-lg font-mono text-[10px] tracking-[0.15em] text-center', status.cls)}>
        {status.text}
      </div>

      {permission === 'denied' && (
        <p className="mt-3 font-serif text-xs text-text-dim font-light text-center">
          Para activarlas, entrá a la configuración del navegador y permitir notificaciones para este sitio.
        </p>
      )}

      {enabled && !swReady && (
        <p className="mt-3 font-serif text-xs text-text-dim font-light text-center">
          ⚠ Service Worker no disponible — las notificaciones pueden perderse al cerrar la pestaña.
        </p>
      )}
    </div>
  )
}