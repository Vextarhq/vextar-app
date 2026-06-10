import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(req) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return Response.json({ error: 'Not configured' }, { status: 503 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  const rawBody = await req.text()
  const signature = req.headers.get('x-signature')

  if (!verifySignature(rawBody, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const eventName = event.meta?.event_name
  const data = event.data?.attributes
  const userId = event.meta?.custom_data?.user_id
  const userEmail = event.data?.attributes?.user_email

  // Detectar el plan según el nombre del producto
  const productName = data?.product_name?.toLowerCase() || ''
  let plan = 'pro'
  if (productName.includes('ultra')) {
    plan = 'ultra'
  } else if (productName.includes('pro')) {
    plan = 'pro'
  }

  if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
    if (!userId) return Response.json({ ok: true })
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      ls_subscription_id: event.data?.id,
      ls_customer_id: data?.customer_id,
      email: userEmail,
      status: 'active',
      plan: plan,
      current_period_end: data?.renews_at,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
  }

  if (eventName === 'subscription_cancelled') {
    if (!userId) return Response.json({ ok: true })
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      ls_subscription_id: event.data?.id,
      ls_customer_id: data?.customer_id,
      email: userEmail,
      status: 'cancelled',
      plan: plan,
      current_period_end: data?.ends_at,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
  }

  return Response.json({ ok: true })
}

function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) return false
  try {
    const hmac = crypto.createHmac('sha256', secret)
    const digest = hmac.update(rawBody).digest('hex')
    return digest === signature
  } catch {
    return false
  }
}
