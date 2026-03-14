import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// PATCH /api/cycles/[id] — update notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { notes } = body

  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('auth0_id', session.user.sub)
    .single()

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('patch_cycles')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .eq('user_id', profile.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

// DELETE /api/cycles/[id] — delete a single cycle
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    .eq('id', params.id)
    .eq('user_id', profile.id) // ensures ownership

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: null })
}
