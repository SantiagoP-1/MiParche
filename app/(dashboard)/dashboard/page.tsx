import { getSession } from '@auth0/nextjs-auth0'
import { createAdminClient } from '@/lib/supabase/server'
import { computeCycle } from '@/lib/cycle-utils'
import type { PatchCycle, UserProfile } from '@/types'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('auth0_id', session!.user.sub)
    .single<UserProfile>()

  const { data: cycle } = await supabase
    .from('patch_cycles')
    .select('*')
    .eq('user_id', profile?.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const computed = cycle ? computeCycle(cycle as PatchCycle) : null

  return (
    <DashboardClient
      user={session!.user}
      profile={profile}
      cycle={cycle as PatchCycle | null}
      computed={computed}
    />
  )
}