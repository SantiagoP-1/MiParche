import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/cycles — get active cycle for current user
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('auth0_id', session.user.sub)
    .single()

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Get active cycle
  const { data: cycle, error } = await supabase
    .from('patch_cycles')
    .select('*')
    .eq('user_id', profile.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: cycle ?? null })
}

// POST /api/cycles — create or update cycle
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { start_date } = body

  if (!start_date) {
    return NextResponse.json({ error: 'start_date is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('auth0_id', session.user.sub)
    .single()

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Mark any existing active cycles as completed
  await supabase
    .from('patch_cycles')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('user_id', profile.id)
    .eq('status', 'active')

  // Create new cycle
  const { data: newCycle, error } = await supabase
    .from('patch_cycles')
    .insert({
      user_id: profile.id,
      start_date,
      patch_type: 'weekly',
      status: 'active',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: newCycle }, { status: 201 })
}

// DELETE /api/cycles — abandon current cycle
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

  await supabase
    .from('patch_cycles')
    .update({ status: 'abandoned', updated_at: new Date().toISOString() })
    .eq('user_id', profile.id)
    .eq('status', 'active')

  return NextResponse.json({ data: null })
}