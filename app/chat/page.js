'use client'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, sessionId })
    })
    const data = await res.json()
    if (data.sessionId) setSessionId(data.sessionId)
    setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060810', color: '#e8edf2', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #1a2035' }}>
        <h1 style={{ margin: 0, color: '#7c6aff' }}>Vextar</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#7c6aff' : '#1a2035', padding: '12px 16px', borderRadius: '12px', maxWidth: '80%', whiteSpace: 'pre-wrap' }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: '#7c6aff' }}>Vextar está escribiendo...</div>}
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid #1a2035', display: 'flex', gap: '10px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Escribe tu pregunta..." style={{ flex: 1, background: '#1a2035', border: '1px solid #2a3045', color: '#e8edf2', padding: '12px', borderRadius: '8px', fontFamily: 'monospace' }} />
        <button onClick={sendMessage} style={{ background: '#7c6aff', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer' }}>Enviar</button>
      </div>
    </div>
  )
}
