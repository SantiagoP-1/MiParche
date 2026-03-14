import { getSession } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('auth0_id', session.user.sub)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { data: cycles, error } = await supabase
    .from('patch_cycles')
    .select('id,start_date,patch_type,status,created_at,updated_at')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: cycles })
}