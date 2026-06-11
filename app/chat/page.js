'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useClerk, useUser } from '@clerk/nextjs'

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
        <button onClick={handleCopy} style={{ background: copied ? 'rgba(107,184,212,0.3)' : 'transparent', color: copied ? '#6bb8d4' : 'rgba(232,237,242,0.4)', border: '1px solid', borderColor: copied ? 'rgba(107,184,212,0.6)' : 'rgba(255,255,255,0.1)', padding: '4px 12px', fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s', borderRadius: '2px' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '16px', overflowX: 'auto', fontSize: '12px', lineHeight: '1.7', color: '#e8edf2', fontFamily: "'Share Tech Mono', monospace", whiteSpace: 'pre' }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#e8edf2', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} style={{ background: 'rgba(107,184,212,0.1)', color: '#6bb8d4', padding: '1px 6px', borderRadius: '3px', fontSize: '11px', fontFamily: "'Share Tech Mono', monospace" }}>{part.slice(1, -1)}</code>
    }
    return part
  })
}

function MessageContent({ content }) {
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
  const segments = []
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'code', language: match[1], content: match[2] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < content.length) {
    segments.push({ type: 'text', content: content.slice(lastIndex) })
  }

  function renderText(text) {
    const lines = text.split('\n')
    const result = []
    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      if (line.trim() === '') {
        result.push(<div key={i} style={{ height: '8px' }} />)
      } else if (/^#{1,3}\s/.test(line)) {
        const level = line.match(/^(#+)/)[1].length
        const txt = line.replace(/^#+\s/, '')
        const sizes = { 1: '18px', 2: '15px', 3: '13px' }
        result.push(<div key={i} style={{ fontSize: sizes[level] || '13px', fontWeight: 700, color: '#6bb8d4', margin: '12px 0 6px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '.05em' }}>{renderInline(txt)}</div>)
      } else if (/^[-*]\s/.test(line.trim())) {
        const items = []
        while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^[-*]\s/, ''))
          i++
        }
        result.push(
          <ul key={i} style={{ paddingLeft: '16px', margin: '6px 0', listStyle: 'none' }}>
            {items.map((item, j) => (
              <li key={j} style={{ position: 'relative', paddingLeft: '14px', marginBottom: '4px', lineHeight: '1.6' }}>
                <span style={{ position: 'absolute', left: 0, color: '#6bb8d4' }}>›</span>
                {renderInline(item)}
              </li>
            ))}
          </ul>
        )
        continue
      } else if (/^\d+\.\s/.test(line.trim())) {
        const items = []
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s/, ''))
          i++
        }
        result.push(
          <ol key={i} style={{ paddingLeft: '16px', margin: '6px 0', listStyle: 'none' }}>
            {items.map((item, j) => (
              <li key={j} style={{ position: 'relative', paddingLeft: '20px', marginBottom: '4px', lineHeight: '1.6' }}>
                <span style={{ position: 'absolute', left: 0, color: '#6bb8d4', fontSize: '11px' }}>{j + 1}.</span>
                {renderInline(item)}
              </li>
            ))}
          </ol>
        )
        continue
      } else {
        result.push(<div key={i} style={{ lineHeight: '1.7', marginBottom: '2px' }}>{renderInline(line)}</div>)
      }
      i++
    }
    return result
  }

  return (
    <div style={{ fontSize: '13px', color: '#e8edf2' }}>
      {segments.map((seg, i) =>
        seg.type === 'code'
          ? <CodeBlock key={i} code={seg.content} language={seg.language} />
          : <div key={i}>{renderText(seg.content)}</div>
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
  const [limitType, setLimitType] = useState('free')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [managingSubscription, setManagingSubscription] = useState(false)
  const bottomRef = useRef(null)
  const { userId } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    fetch('/api/history').then(r => r.json()).then(d => setHistory(d.conversations || []))
  }, [sessionId])


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleManageSubscription() {
    setManagingSubscription(true)
    try {
      const res = await fetch('/api/manage-subscription')
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        window.location.href = '/pricing'
      }
    } catch (e) {
      window.location.href = '/pricing'
    } finally {
      setManagingSubscription(false)
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading || limitReached || !userId) return
    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const userEmail = user?.primaryEmailAddress?.emailAddress || null

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, sessionId, userId, userEmail })
    })

    if (res.status === 403) {
      const data = await res.json()
      if (data.error === 'limit_reached') {
        setLimitReached(true)
        setLimitType(data.plan || 'free')
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
        html, body { height: 100%; overflow: hidden; }
        .chat-layout {
          height: 100dvh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Share Tech Mono', monospace;
          display: flex;
          overflow: hidden;
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(6,8,16,0.7); z-index: 99; backdrop-filter: blur(2px); }
        .sidebar-overlay.open { display: block; }
        .sidebar {
          width: 260px;
          background: var(--bg2);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow: hidden;
        }
        .sidebar-top { padding: 24px 16px 0; flex-shrink: 0; }
        .sidebar-logo { font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--text); margin-bottom: 24px; padding: 0 8px; }
        .sidebar-logo span { color: var(--accent); }
        .new-chat-btn { background: transparent; color: var(--accent); border: 1px solid var(--border-bright); padding: 10px 16px; font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; margin-bottom: 24px; transition: background .2s, box-shadow .2s; clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px)); text-align: left; width: 100%; }
        .new-chat-btn:hover { background: var(--accent-glow); box-shadow: 0 0 16px var(--accent-glow); }
        .sidebar-label { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 10px; padding: 0 8px; }
        .history-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding: 0 16px; min-height: 0; }
        .history-list::-webkit-scrollbar { width: 3px; }
        .history-list::-webkit-scrollbar-thumb { background: var(--border); }
        .history-item { background: transparent; color: var(--text-dim); border: 1px solid transparent; padding: 9px 12px; cursor: pointer; text-align: left; font-size: 12px; font-family: 'Share Tech Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: all .2s; border-radius: 2px; width: 100%; flex-shrink: 0; }
        .history-item:hover { color: var(--text); border-color: var(--border); background: rgba(255,255,255,0.03); }
        .history-item.active { color: var(--accent); border-color: var(--border-bright); background: var(--accent-glow); }
        .sidebar-bottom { padding: 16px; flex-shrink: 0; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
        .chat-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
        .chat-topbar { height: 56px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; gap: 12px; flex-shrink: 0; background: var(--bg); z-index: 10; }
        .hamburger-btn { display: flex; background: transparent; border: none; cursor: pointer; padding: 4px; flex-direction: column; gap: 5px; flex-shrink: 0; }
        .hamburger-btn span { display: block; width: 20px; height: 2px; background: var(--accent); }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: blink 2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .topbar-text { font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--text-faint); }
        .messages-area { flex: 1; overflow-y: auto; padding: 32px 24px; display: flex; flex-direction: column; gap: 20px; }
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
        .msg-bubble { padding: 14px 18px; max-width: 80%; font-size: 13px; line-height: 1.75; word-break: break-word; }
        .msg-bubble.user { background: var(--accent); color: #060810; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%); white-space: pre-wrap; max-width: 70%; }
        .msg-bubble.assistant { background: var(--bg3); color: var(--text); border: 1px solid var(--border); clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px); max-width: 88%; }
        .typing-indicator { display: flex; align-items: center; gap: 10px; color: var(--accent); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; padding: 0 4px; }
        .typing-dots { display: flex; gap: 4px; }
        .typing-dots span { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); animation: dotPulse 1.2s ease-in-out infinite; }
        .typing-dots span:nth-child(2) { animation-delay: .2s; }
        .typing-dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes dotPulse { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        .input-area { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 12px; align-items: flex-end; flex-shrink: 0; background: var(--bg); }
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
        .manage-btn { background: transparent; color: var(--text-dim); border: 1px solid var(--border); padding: 10px 16px; font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; transition: background .2s, color .2s, border-color .2s; clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px)); text-align: left; width: 100%; }
        .manage-btn:hover { color: var(--text); border-color: var(--border-bright); background: rgba(255,255,255,0.03); }
        .manage-btn:disabled { opacity: .4; cursor: not-allowed; }
        @media(max-width: 700px) {
          .sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transform: translateX(-100%); transition: transform .3s ease; }
          .sidebar.open { transform: translateX(0); }
          .msg-bubble.assistant { max-width: 100%; }
          .msg-bubble.user { max-width: 85%; }
          .messages-area { padding: 20px 16px; }
          .input-area { padding: 12px 16px; }
        }
      `}</style>

      {limitReached && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚡</div>
            <div className="modal-title">Limit <span>reached</span></div>
            {limitType === 'pro' ? (
              <p className="modal-desc">You've used your 45 Pro messages this week. Upgrade to Ultra for unlimited access.</p>
            ) : (
              <p className="modal-desc">You've used your 15 free messages this week. Upgrade to Pro for 45 messages/week or Ultra for unlimited access.</p>
            )}
            <button className="modal-btn" onClick={() => window.location.href = '/pricing'}>
              View plans →
            </button>
          </div>
        </div>
      )}

      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="chat-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-top">
            <div className="sidebar-logo"><span>V</span>EXTAR</div>
            <button className="new-chat-btn" onClick={newChat}>+ New chat</button>
            <div className="sidebar-label">Conversations</div>
          </div>
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
          <div className="sidebar-bottom">
            <button
              className="manage-btn"
              onClick={handleManageSubscription}
              disabled={managingSubscription}
            >
              {managingSubscription ? '⏳ Loading...' : '⚙ Manage Subscription'}
            </button>
            <button onClick={() => window.location.href = '/pricing'} className="new-chat-btn" style={{ background: 'rgba(107,184,212,0.15)', borderColor: 'rgba(107,184,212,0.6)', marginBottom: 0 }}>
              ⚡ Upgrade to Pro
            </button>
            <button onClick={() => signOut({ redirectUrl: '/landing' })} className="new-chat-btn" style={{ marginBottom: 0 }}>
              Sign Out
            </button>
          </div>
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
