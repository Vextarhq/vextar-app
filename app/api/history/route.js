import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const user = await currentUser()
  if (!user) return Response.json({ conversations: [] })

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  const { data } = await supabase
    .from('conversations')
    .select('id, title, messages, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return Response.json({ conversations: data || [] })
}
