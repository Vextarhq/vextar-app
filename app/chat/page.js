'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useClerk } from '@clerk/nextjs'

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ position: 'relative', margin: '12px 0', background: '#060810', border: '1px solid rgba(107,184,212,0.25)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: 'rgba(107,184,212,0.08)', borderBottom: '1px solid rgba(107,184,212,0.15)' }}>
        <span style={{ fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(107,184,212,0.6)', fontFamily: "'Share Tech Mono', monospace" }}>{language || 'code'}</span>
        <button onClick={handleCopy} style={{ background: copied ? 'rgba(107,184,212,0.3)' : 'transparent', color: copied ? '#6bb8d4' : 'rgba(232,237,242,0.4)', border: '1px solid', borderColor: copied ? 'rgba(107,184,212,0.6)' : 'rgba(255,255,255,0.1)', padding: '4px 12px', fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '16px', overflowX: 'auto', fontSize: '12px', lineHeight: '1.7', color: '#e8edf2', fontFamily: "'Share Tech Mono', monospace", whiteSpace: 'pre' }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function MessageContent({ content }) {
  const parts = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', language: match[1], content: match[2] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }
  return (
    <div>
      {parts.map((part, i) =>
        part.type === 'code'
          ? <CodeBlock key={i} code={part.content} language={part.language} />
          : <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part.content}</span>
      )}
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [history, setHistory] = useState([])
  const [limitReached, setLimitReached] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef(null)
  const { userId } = useAuth()
  const { signOut } = useClerk()

  useEffect(() => {
    fetch('/api/history').then(r => r.json()).then(d => setHistory(d.conversations || []))
  }, [sessionId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    if (!input.trim() || loading || limitReached || !userId) return
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, sessionId, userId })
    })

    if (res.status === 403) {
      const data = await res.json()
      if (data.error === 'limit_reached') {
        setLimitReached(true)
        setMessages(prev => prev.slice(0, -1))
        setLoading(false)
        return
      }
    }

    const data = await res.json()
    if (data.sessionId) setSessionId(data.sessionId)
    setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    setLoading(false)
  }

  function loadConversation(conv) {
    setMessages(conv.messages)
    setSessionId(conv.id)
    setSidebarOpen(false)
  }

  function newChat() {
    setMessages([])
    setSessionId(null)
    setSidebarOpen(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #060810; --bg2: #0b0f1a; --bg3: #0d1320;
          --border: rgba(255,255,255,0.07);
          --border-bright: rgba(107,184,212,0.25);
          --accent: #6bb8d4;
          --accent-glow: rgba(107,184,212,0.15);
          --text: #e8edf2;
          --text-dim: rgba(232,237,242,0.5);
          --text-faint: rgba(232,237,242,0.2);
        }
        .chat-layout { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Share Tech Mono', monospace; display: flex; }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(6,8,16,0.7); z-index: 99; backdrop-filter: blur(2px); }
        .sidebar-overlay.open { display: block; }
        .sidebar { width: 260px; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 24px 16px; flex-shrink: 0; }
        .sidebar-logo { font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--text); margin-bottom: 24px; padding: 0 8px; }
        .sidebar-logo span { color: var(--accent); }
        .new-chat-btn { background: transparent; color: var(--accent); border: 1px solid var(--border-bright); padding: 10px 16px; font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; margin-bottom: 24px; transition: background .2s, box-shadow .2s; clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px)); text-align: left; }
        .new-chat-btn:hover { background: var(--accent-glow); box-shadow: 0 0 16px var(--accent-glow); }
        .sidebar-label { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 10px; padding: 0 8px; }
        .history-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
        .history-list::-webkit-scrollbar { width: 3px; }
        .history-list::-webkit-scrollbar-thumb { background: var(--border); }
        .history-item { background: transparent; color: var(--text-dim); border: 1px solid transparent; padding: 9px 12px; cursor: pointer; text-align: left; font-size: 12px; font-family: 'Share Tech Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: all .2s; border-radius: 2px; }
        .history-item:hover { color: var(--text); border-color: var(--border); background: rgba(255,255,255,0.03); }
        .history-item.active { color: var(--accent); border-color: var(--border-bright); background: var(--accent-glow); }
        .chat-main { flex: 1; display: flex; flex-direction: column; min-height: 0; }
        .chat-topbar { height: 56px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; gap: 12px; flex-shrink: 0; position: sticky; top: 0; z-index: 50; background: var(--bg); }
        .hamburger-btn { display: none; background: transparent; border: none; cursor: pointer; padding: 4px; flex-direction: column; gap: 5px; flex-shrink: 0; }
        .hamburger-btn span { display: block; width: 20px; height: 2px; background: var(--accent); }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: blink 2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .topbar-text { font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--text-faint); }
        .messages-area { flex: 1; overflow-y: auto; padding: 32px 24px; display: flex; flex-direction: column; gap: 24px; }
        .messages-area::-webkit-scrollbar { width: 3px; }
        .messages-area::-webkit-scrollbar-thumb { background: var(--border); }
        .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; opacity: 0.4; }
        .empty-title { font-family: 'Rajdhani', sans-serif; font-size: 48px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--text); }
        .empty-title span { color: var(--accent); }
        .empty-sub { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-faint); }
        .msg-row { display: flex; flex-direction: column; gap: 4px; }
        .msg-row.user { align-items: flex-end; }
        .msg-row.assistant { align-items: flex-start; }
        .msg-label { font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: var(--text-faint); padding: 0 4px; }
        .msg-bubble { padding: 14px 18px; max-width: 75%; font-size: 13px; line-height: 1.75; }
        .msg-bubble.user { background: var(--accent); color: #060810; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%); white-space: pre-wrap; }
        .msg-bubble.assistant { background: var(--bg3); color: var(--text); border: 1px solid var(--border); clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px); max-width: 90%; }
        .typing-indicator { display: flex; align-items: center; gap: 10px; color: var(--accent); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; padding: 0 4px; }
        .typing-dots { display: flex; gap: 4px; }
        .typing-dots span { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); animation: dotPulse 1.2s ease-in-out infinite; }
        .typing-dots span:nth-child(2) { animation-delay: .2s; }
        .typing-dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes dotPulse { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        .input-area { padding: 20px 24px; border-top: 1px solid var(--border); display: flex; gap: 12px; align-items: flex-end; flex-shrink: 0; background: var(--bg); }
        .input-wrapper { flex: 1; border: 1px solid var(--border); background: var(--bg2); clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); transition: border-color .2s; }
        .input-wrapper:focus-within { border-color: var(--border-bright); }
        .input-wrapper.disabled { opacity: .4; pointer-events: none; }
        .chat-input { width: 100%; background: transparent; border: none; outline: none; color: var(--text); font-family: 'Share Tech Mono', monospace; font-size: 13px; padding: 14px 18px; resize: none; min-height: 48px; max-height: 160px; line-height: 1.6; }
        .chat-input::placeholder { color: var(--text-faint); }
        .send-btn { background: var(--accent); color: #060810; border: none; padding: 14px 22px; font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: opacity .2s, box-shadow .2s; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); flex-shrink: 0; align-self: flex-end; height: 48px; }
        .send-btn:hover { opacity: .85; box-shadow: 0 0 20px var(--accent-glow); }
        .send-btn:disabled { opacity: .4; cursor: not-allowed; }
        .modal-overlay { position: fixed; inset: 0; z-index: 999; background: rgba(6,8,16,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; }
        .modal { background: var(--bg2); border: 1px solid var(--border-bright); padding: 48px 40px; max-width: 480px; width: 90%; text-align: center; position: relative; clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); }
        .modal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); }
        .modal-icon { font-size: 32px; margin-bottom: 20px; }
        .modal-title { font-family: 'Rajdhani', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--text); margin-bottom: 12px; }
        .modal-title span { color: var(--accent); }
        .modal-desc { font-size: 12px; color: var(--text-dim); line-height: 1.8; margin-bottom: 32px; }
        .modal-btn { background: var(--accent); color: #060810; border: none; padding: 14px 32px; font-family: 'Share Tech Mono', monospace; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: opacity .2s, box-shadow .2s; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); }
        .modal-btn:hover { opacity: .85; box-shadow: 0 0 24px var(--accent-glow); }
        @media(max-width: 700px) {
          .sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transform: translateX(-100%); transition: transform .3s ease; }
          .sidebar.open { transform: translateX(0); }
          .hamburger-btn { display: flex; }
          .msg-bubble.assistant { max-width: 100%; }
        }
      `}</style>

      {limitReached && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚡</div>
            <div className="modal-title">Limit <span>reached</span></div>
            <p className="modal-desc">You've used your 40 free messages this month</p>
            <button className="modal-btn" onClick={() => window.location.href = '/pricing'}>
              View Pro plans →
            </button>
          </div>
        </div>
      )}

      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="chat-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo"><span>V</span>EXTAR</div>
          <button className="new-chat-btn" onClick={newChat}>+ New chat</button>
          <div className="sidebar-label">Conversations</div>
          <div className="history-list">
            {history.map(conv => (
              <button
                key={conv.id}
                className={`history-item ${sessionId === conv.id ? 'active' : ''}`}
                onClick={() => loadConversation(conv)}
              >
                {conv.title || 'Sin título'}
              </button>
            ))}
          </div>
          <button onClick={() => window.location.href = '/pricing'} className="new-chat-btn" style={{ background: 'rgba(107,184,212,0.15)', borderColor: 'rgba(107,184,212,0.6)' }}>
            ⚡ Upgrade to Pro
          </button>
          <button onClick={() => signOut({ redirectUrl: '/landing' })} className="new-chat-btn" style={{ marginTop: '12px' }}>
            Sign Out
          </button>
        </aside>

        <main className="chat-main">
          <div className="chat-topbar">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span></span><span></span><span></span>
            </button>
            <span className="status-dot"></span>
            <span className="topbar-text">Vextar AI — Online</span>
          </div>

          <div className="messages-area">
            {messages.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-title"><span>V</span>EXTAR</div>
                <div className="empty-sub">AI Code Intelligence — Ready</div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.role}`}>
                <span className="msg-label">{m.role === 'user' ? 'You' : 'Vextar'}</span>
                <div className={`msg-bubble ${m.role}`}>
                  {m.role === 'assistant'
                    ? <MessageContent content={m.content} />
                    : m.content
                  }
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg-row assistant">
                <span className="msg-label">Vextar</span>
                <div className="typing-indicator">
                  <div className="typing-dots"><span></span><span></span><span></span></div>
                  Processing
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="input-area">
            <div className={`input-wrapper ${limitReached ? 'disabled' : ''}`}>
              <textarea
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder={limitReached ? 'Limit reached' : 'Describe the code you need... (Enter to send)'}
                rows={1}
                disabled={limitReached}
              />
            </div>
            <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim() || limitReached}>
              Send →
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
