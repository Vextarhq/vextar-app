import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  const { userId } = await request.json()

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('ls_customer_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !subscription?.ls_customer_id) {
    return Response.json({ error: 'No subscription found' }, { status: 404 })
  }

  const portalUrl = `https://app.lemonsqueezy.com/my-orders/${subscription.ls_customer_id}`

  return Response.json({ url: portalUrl })
}
