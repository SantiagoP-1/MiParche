import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Mono } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Mi Parche · Recordatorio de anticonceptivo',
  description: 'Nunca te olvides de cambiar tu parche anticonceptivo.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0c0c0f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}