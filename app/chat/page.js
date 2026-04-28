'use client'
import { useState, useEffect } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetch('/api/history').then(r => r.json()).then(d => setHistory(d.conversations || []))
  }, [sessionId])

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

  function loadConversation(conv) {
    setMessages(conv.messages)
    setSessionId(conv.id)
  }

  function newChat() {
    setMessages([])
    setSessionId(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060810', color: '#e8edf2', fontFamily: 'monospace', display: 'flex' }}>
      <div style={{ width: '260px', background: '#0d1117', borderRight: '1px solid #1a2035', display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <h2 style={{ color: '#7c6aff', margin: '0 0 16px 0' }}>Vextar</h2>
        <button onClick={newChat} style={{ background: '#7c6aff', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '16px' }}>+ Nuevo chat</button>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {history.map(conv => (
            <button key={conv.id} onClick={() => loadConversation(conv)} style={{ background: sessionId === conv.id ? '#1a2035' : 'transparent', color: '#e8edf2', border: '1px solid #1a2035', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conv.title || 'Sin título'}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
    </div>
  )
}
