// public/sw.js — Service Worker para notificaciones push
// Este archivo debe estar en /public/sw.js para que Next.js lo sirva

const CACHE_NAME = 'miparche-v1'

// Instalar el SW
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

// Recibir notificaciones push del servidor
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title || 'Mi Parche ♡', {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-96.png',
      tag: data.tag || 'miparche',
      renotify: true,
      data: { url: data.url || '/dashboard' },
    })
  )
})

// Click en la notificación → abrir la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una pestaña abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      // Si no hay pestaña, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
