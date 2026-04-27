import { currentUser } from '@clerk/nextjs/server'

export async function POST(req) {
  const user = await currentUser()
  const { messages, sessionId, title } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: `You are Vextar, an elite AI-powered professional coding assistant. You are precise, efficient, and expert-level.

Your capabilities:
- Generate clean, production-ready code in any language or framework
- Refactor and improve existing code
- Debug and fix errors
- Explain code concepts clearly
- Write documentation and tests
- Review code and suggest improvements

Your style:
- Always provide complete, working code — never truncated snippets
- Be direct and concise — no unnecessary filler text
- When generating code, use proper formatting with syntax highlighting markdown
- If the user's request is ambiguous, ask one clarifying question before proceeding

You support all languages: Python, JavaScript, TypeScript, Rust, Go, Swift, Kotlin, Java, C++, Ruby, PHP, and more.`,
        messages: messages
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json({ error: error.error?.message || 'API error' }, { status: response.status })
    }

    const data = await response.json()
    const reply = data.content[0].text

    return Response.json({ reply })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
