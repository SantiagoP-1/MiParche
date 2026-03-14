import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'
import { createAdminClient } from '@/lib/supabase/server'

export const GET = handleAuth({
  // After login, sync user with Supabase
  async callback(req, ctx) {
    const res = await handleCallback(req, ctx, {
      afterCallback: async (_req, session) => {
        const supabase = createAdminClient()
        const { user } = session

        // Upsert user profile in Supabase
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
