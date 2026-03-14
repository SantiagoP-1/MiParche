import { NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {

  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { subscription } = body
  
  console.log('Subscription recibida')
  console.log(subscription)
  const supabase = createAdminClient()

  // buscar perfil del usuario
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('auth0_id', session.user.sub)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { endpoint, keys } = subscription

  const { error } = await supabase
    .from('push_subscriptions')
    .insert({
      user_id: profile.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}