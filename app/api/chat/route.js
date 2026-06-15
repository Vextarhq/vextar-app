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
  const { messages, sessionId, title, userId, userEmail, imageBase64 } = await req.json()

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
        return Response.json({ error: 'limit_reached', count: currentCount, plan: isPro ? 'pro' : 'free' }, { status: 403 })
      }
    }
  }

  const systemPrompt = `You are Vextar, an elite AI-powered coding assistant built for professional developers and entrepreneurs. You combine deep technical expertise with real-world practicality.

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

  try {
    let reply

    // Si hay imagen → usar GPT-4o-mini (visión)
    if (imageBase64) {
      const lastUserMessage = messages[messages.length - 1]?.content || ''
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 4096,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
                { type: 'text', text: lastUserMessage || 'Analyze this image and help me with the code.' },
                { type: 'image_url', image_url: { url: imageBase64 } }
              ]
            }
          ]
        })
      })

      if (!openaiRes.ok) {
        const err = await openaiRes.json()
        return Response.json({ error: err.error?.message || 'Vision API error' }, { status: openaiRes.status })
      }

      const openaiData = await openaiRes.json()
      reply = openaiData.choices[0].message.content

    } else {
      // Sin imagen → usar DeepSeek V4 Flash
      const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-v4-flash',
          max_tokens: 8192,
          temperature: 0.3,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ]
        })
      })

      if (!deepseekRes.ok) {
        const err = await deepseekRes.json()
        return Response.json({ error: err.error?.message || 'API error' }, { status: deepseekRes.status })
      }

      const deepseekData = await deepseekRes.json()
      reply = deepseekData.choices[0].message.content
    }

    // Construir el mensaje del usuario con imagen si existe
    const lastUserMsg = messages[messages.length - 1]
    const messagesWithImage = imageBase64
      ? [...messages.slice(0, -1), { ...lastUserMsg, image: imageBase64 }]
      : messages

    const allMessages = [...messagesWithImage, { role: 'assistant', content: reply }]

    if (userId) {
      const week = getWeekKey()
      const { data: existingRow } = await supabase
        .from('message_counts')
        .select('id, count')
        .eq('user_id', userId)
        .eq('week', week)
        .single()

      if (existingRow) {
        await supabase.from('message_counts').update({ count: existingRow.count + 1 }).eq('id', existingRow.id)
      } else {
        await supabase.from('message_counts').insert({ user_id: userId, week: week, count: 1, month: new Date().toISOString().slice(0, 7) })
      }

      const sessionTitle = title || messages[0]?.content?.slice(0, 50) || 'New chat'

      if (sessionId) {
        await supabase.from('conversations').update({ messages: allMessages, updated_at: new Date().toISOString() }).eq('id', sessionId)
        return Response.json({ reply, sessionId })
      } else {
        const { data: created } = await supabase.from('conversations').insert({
          user_id: userId,
          email: userEmail || null,
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
