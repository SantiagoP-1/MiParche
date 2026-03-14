import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ThemeProvider } from '@/components/ThemeProvider'
import type { UserProfile, Theme } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('theme')
    .eq('auth0_id', session.user.sub)
    .single<Pick<UserProfile, 'theme'>>()

  const initialTheme: Theme = profile?.theme ?? 'dark'

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <div className="relative z-10 min-h-screen">
        {/* Top nav */}
        <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="font-serif text-xl font-light">
              Mi <em className="italic text-accent">Parche</em>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard/history"
                className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase hover:text-accent transition-colors"
              >
                Historial
              </Link>
              <Link
                href="/dashboard/settings"
                className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase hover:text-accent transition-colors"
              >
                Ajustes
              </Link>
              <a
                href="/api/auth/logout"
                className="font-mono text-[10px] tracking-[0.2em] text-text-dim uppercase hover:text-rose-patch transition-colors"
              >
                Salir
              </a>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="max-w-2xl mx-auto px-6 py-10">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
