import { createClient } from '@supabase/supabase-js'

const FREE_LIMIT = 15
const PRO_LIMIT = 45

function getWeekKey() {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = (day === 0 ? -6 : 1 - day)
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  const yyyy = monday.getUTCFullYear()
  const mm = String(monday.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(monday.getUTCDate()).padStart(2, '0')
  return `${yyyy}-W${mm}-${dd}`
}

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
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', userId)
      .single()

    const isPro = subscription?.status === 'active' && subscription?.plan === 'pro'
    const isUltra = subscription?.status === 'active' && subscription?.plan === 'ultra'

    // Ultra = mensajes ilimitados, no hay limite
    if (!isUltra) {
      const week = getWeekKey()
      const { data: countRow } = await supabase
        .from('message_counts')
        .select('count')
        .eq('user_id', userId)
        .eq('week', week)
        .single()

      const currentCount = countRow?.count || 0
      const limit = isPro ? PRO_LIMIT : FREE_LIMIT

      if (currentCount >= limit) {
        return Response.json({ error: 'limit_reached', count: currentCount }, { status: 403 })
      }
    }
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 8192,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `You are Vextar, an elite AI-powered coding assistant built for professional developers and entrepreneurs. You combine deep technical expertise with real-world practicality.

CORE BEHAVIOR:
- Always respond in the same language the user writes in
- Be direct and confident. No unnecessary filler text
- Think step by step before generating any code
- Always deliver complete, working, production-ready code — NEVER truncate

CODE QUALITY:
- Write compact, clean code — no unnecessary comments or blank lines
- Always deliver in a single HTML file with CSS and JS included unless asked otherwise
- Use modern best practices: flexbox, grid, CSS variables, semantic HTML
- All code must be fully responsive for mobile, tablet and desktop
- Optimize for performance and fast loading

BEFORE GENERATING:
- If the user asks for a landing page or website, first ask: purpose, colors, style (modern/minimal/luxury/bold), and sections needed
- If the request is vague, ask 1-2 clarifying questions before coding

PROBLEM SOLVING:
- When given broken or incomplete code, diagnose the exact problem first, then deliver the complete fixed version
- When debugging, explain what was wrong in one sentence, then show the fix
- If the user's approach has a better alternative, suggest it briefly

SPECIALTIES:
- Landing pages and full websites
- Web apps and dashboards
- APIs and backend logic
- Database queries and structure
- UI/UX with modern animations and effects
- SEO optimization
- Performance optimization

PERSONALITY:
- Professional but approachable
- Confident, never uncertain
- Solutions-focused, not excuse-focused`
          },
          ...messages
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json({ error: error.error?.message || 'API error' }, { status: response.status })
    }

    const data = await response.json()
    const reply = data.choices[0].message.content
    const allMessages = [...messages, { role: 'assistant', content: reply }]

    if (userId) {
      const week = getWeekKey()

      const { data: existingRow } = await supabase
        .from('message_counts')
        .select('id, count')
        .eq('user_id', userId)
        .eq('week', week)
        .single()

      if (existingRow) {
        await supabase
          .from('message_counts')
          .update({ count: existingRow.count + 1 })
          .eq('id', existingRow.id)
      } else {
        await supabase
          .from('message_counts')
          .insert({ user_id: userId, week: week, count: 1, month: new Date().toISOString().slice(0, 7) })
      }

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
