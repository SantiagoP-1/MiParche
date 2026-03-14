import { getSession } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// DELETE /api/cycles/clear — delete ALL cycles for current user
export async function DELETE() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('auth0_id', session.user.sub)
    .single()

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { error } = await supabase
    .from('patch_cycles')
    .delete()
    .eq('user_id', profile.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: null })
}
