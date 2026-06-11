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
    .select('ls_subscription_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .not('ls_subscription_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !subscription?.ls_subscription_id) {
    console.log('Supabase error:', error, 'subscription:', subscription)
    return Response.json({ error: 'No subscription found' }, { status: 404 })
  }

  const res = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions/${subscription.ls_subscription_id}`,
    {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
    }
  )

  const lsData = await res.json()
  console.log('LS response status:', res.status)
  console.log('LS urls:', JSON.stringify(lsData?.data?.attributes?.urls))

  if (!res.ok) {
    return Response.json({ error: 'Failed to get subscription', details: lsData }, { status: 500 })
  }

  const urls = lsData?.data?.attributes?.urls
  const portalUrl = urls?.customer_portal || urls?.customer_portal_update_payment || urls?.update_payment_method

  if (!portalUrl) {
    console.log('All URLs available:', JSON.stringify(urls))
    return Response.json({ error: 'Portal URL not found', urls }, { status: 500 })
  }

  return Response.json({ url: portalUrl })
}
