import { createClient } from '@supabase/supabase-js'

const FREE_LIMIT = 40

export async function POST(req) {
  const { messages, sessionId, title, userId } = await req.json()
  console.log('userId recibido:', userId, 'tipo:', typeof userId)

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  if (userId) {
    // Verificar si usuario es Pro
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', userId)
      .single()

    const isPro = subscription?.status === 'active' && subscription?.plan === 'pro'

    // Solo aplicar límite si NO es pro
    if (!isPro) {
      const month = new Date().toISOString().slice(0, 7)
      const { data: countRow } = await supabase
        .from('message_counts')
        .select('count')
        .eq('user_id', userId)
        .eq('month', month)
        .single()

      const currentCount = countRow?.count || 0
      if (currentCount >= FREE_LIMIT) {
        return Response.json({ error: 'limit_reached', count: currentCount }, { status: 403 })
      }
    }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: `You are Vextar, an elite AI-powered professional coding assistant. You are precise, efficient, and expert-level.`,
        messages: messages
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json({ error: error.error?.message || 'API error' }, { status: response.status })
    }

    const data = await response.json()
    const reply = data.content[0].text
    const allMessages = [...messages, { role: 'assistant', content: reply }]

    if (userId) {
      const month = new Date().toISOString().slice(0, 7)

      await supabase.rpc('increment_message_count', {
        p_user_id: userId,
        p_month: month
      })

      const sessionTitle = title || messages[0]?.content?.slice(0, 50) || 'New chat'

      if (sessionId) {
        await supabase.from('conversations').update({
          messages: allMessages,
          updated_at: new Date().toISOString()
        }).eq('id', sessionId)
        return Response.json({ reply, sessionId })
      } else {
        const { data: created } = await supabase.from('conversations').insert({
          user_id: userId,
          title: sessionTitle,
          messages: allMessages
        }).select()
        return Response.json({ reply, sessionId: created?.[0]?.id })
      }
    }

    return Response.json({ reply })

  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
