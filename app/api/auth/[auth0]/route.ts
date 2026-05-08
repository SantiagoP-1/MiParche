import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'
import { createAdminClient } from '@/lib/supabase/server'

export const GET = handleAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async callback(req: any, ctx: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await handleCallback(req, ctx, {
      afterCallback: async (_req: any, session: any) => {
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