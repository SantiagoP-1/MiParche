import { getSession } from '@auth0/nextjs-auth0'
import { createAdminClient } from '@/lib/supabase/server'
import type { UserProfile } from '@/types'
import { SettingsClient } from '@/components/dashboard/SettingsClient'

export default async function SettingsPage() {
  const session = await getSession()
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('auth0_id', session!.user.sub)
    .single<UserProfile>()

  return <SettingsClient profile={profile} user={session!.user} />
}
