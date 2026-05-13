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
  const signature = req.headers.get('paddle-signature')

  if (!verifyPaddleSignature(rawBody, signature, process.env.PADDLE_WEBHOOK_SECRET)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const { event_type, data } = event

  if (event_type === 'subscription.activated' || event_type === 'subscription.updated') {
    const userId = data.custom_data?.userId
    if (!userId) return Response.json({ ok: true })
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      paddle_subscription_id: data.id,
      paddle_customer_id: data.customer_id,
      status: 'active',
      plan: 'pro',
      current_period_end: data.current_billing_period?.ends_at,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
  }

  if (event_type === 'subscription.canceled' || event_type === 'subscription.paused') {
    const userId = data.custom_data?.userId
    if (!userId) return Response.json({ ok: true })
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      paddle_subscription_id: data.id,
      status: 'canceled',
      plan: 'free',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
  }

  return Response.json({ ok: true })
}

function verifyPaddleSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false
  try {
    const parts = Object.fromEntries(signature.split(';').map(p => p.split('=')))
    const ts = parts.ts
    const h1 = parts.h1
    const signed = `${ts}:${rawBody}`
    const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex')
    return expected === h1
  } catch {
    return false
  }
}
