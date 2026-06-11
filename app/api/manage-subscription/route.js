import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('ls_subscription_id, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .not('ls_subscription_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !subscription?.ls_subscription_id) {
    return Response.json({ error: 'No subscription found' }, { status: 404 })
  }

  // Obtener el portal URL via subscription ID
  const res = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions/${subscription.ls_subscription_id}`,
    {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
    }
  )

  if (!res.ok) {
    return Response.json({ error: 'Failed to get subscription' }, { status: 500 })
  }

  const data = await res.json()
  const portalUrl = data?.data?.attributes?.urls?.customer_portal

  if (!portalUrl) {
    return Response.json({ error: 'Portal URL not found' }, { status: 500 })
  }

  return Response.json({ url: portalUrl })
}
