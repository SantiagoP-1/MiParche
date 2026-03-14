import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// PATCH /api/settings — update user profile settings
export async function PATCH(req: NextRequest) {
  const res = new NextResponse()
  const session = await getSession(req, res)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { notification_hour, timezone, name, theme } = body

  if (
    notification_hour !== undefined &&
    (typeof notification_hour !== 'number' || notification_hour < 0 || notification_hour > 23)
  ) {
    return NextResponse.json({ error: 'notification_hour must be between 0 and 23' }, { status: 400 })
  }

  if (theme !== undefined && !['dark', 'light'].includes(theme)) {
    return NextResponse.json({ error: 'theme must be dark or light' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...(name !== undefined && { name }),
      ...(notification_hour !== undefined && { notification_hour }),
      ...(timezone !== undefined && { timezone }),
      ...(theme !== undefined && { theme }),
      updated_at: new Date().toISOString(),
    })
    .eq('auth0_id', session.user.sub)
    .select()
    .single()

    if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }