import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createAdminClient } from '@/lib/supabase/server'

export const GET = handleAuth({
  async callback(req: NextApiRequest, ctx: NextApiResponse) {
    const res = await handleCallback(req, ctx, {
      afterCallback: async (_req, session) => {
        const supabase = createAdminClient()
        const { user } = session

        await supabase.from('user_profiles').upsert(
          {
            auth0_id: user.sub,
            email: user.email,
            name: user.name ?? null,
            avatar_url: user.picture ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'auth0_id' }
        )

        return session
      },
    })
    return res
  },
})