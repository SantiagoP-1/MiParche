import { getSession } from '@auth0/nextjs-auth0'
import { createAdminClient } from '@/lib/supabase/server'
import { computeCycle, getCycleNumber } from '@/lib/cycle-utils'
import type { PatchCycle, UserProfile } from '@/types'
import { HistoryClient } from '@/components/dashboard/HistoryClient'

export default async function HistoryPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('auth0_id', session!.user.sub)
    .single<UserProfile>()

  const { data: cycles } = await supabase
    .from('patch_cycles')
    .select('*')
    .eq('user_id', profile?.id)
    .order('created_at', { ascending: false })

  const entries = (cycles ?? []).map((cycle: PatchCycle) => {
    const isActive = cycle.status === 'active'
    const computed = isActive ? computeCycle(cycle) : null
    const startDate = new Date(cycle.start_date)

    // For completed cycles, duration is 28 days. For active, days elapsed so far.
    const now = new Date()
    const durationDays = isActive
      ? Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 28

    return {
      cycle,
      computed,
      durationDays,
      cycleNumber: getCycleNumber(startDate),
    }
  })

  return <HistoryClient entries={entries} />
}
