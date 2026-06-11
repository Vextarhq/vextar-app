'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Landing() {
  const router = useRouter()
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const cur = cursorRef.current
    const ring = ringRef.current
    let mx = 0, my = 0, rx = 0, ry = 0
    const move = e => { mx = e.clientX; my = e.clientY; cur.style.left = mx+'px'; cur.style.top = my+'px' }
    const animRing = () => { rx += (mx-rx)*.1; ry += (my-ry)*.1; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing) }
    document.addEventListener('mousemove', move)
    animRing()
    document.querySelectorAll('a, button, input').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'))
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'))
    })
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('in'), e.target.dataset.delay || 0) })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach((el, i) => { el.dataset.delay = (i % 4) * 90; revObs.observe(el) })
    const metricData = [
      { id:'m1', val:98, suffix:'%', float:false },
      { id:'m2', val:0.8, suffix:'s', float:true },
      { id:'m3', val:40, suffix:'+', float:false },
      { id:'m4', val:12, suffix:'k', float:false }
    ]
    const metObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        metricData.forEach(m => {
          const el = document.getElementById(m.id); if (!el) return
          const t0 = Date.now()
          const tick = () => { const p=Math.min((Date.now()-t0)/1200,1); const ease=1-Math.pow(1-p,3); el.textContent=(m.float?(m.val*ease).toFixed(1):Math.floor(m.val*ease))+m.suffix; if(p<1) requestAnimationFrame(tick) }
          tick()
        })
        document.querySelectorAll('.metric').forEach(m => m.classList.add('in'))
        metObs.unobserve(e.target)
      })
    }, { threshold: 0.3 })
    const ms = document.querySelector('.metrics'); if (ms) metObs.observe(ms)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  const goToLogin = () => router.push('/login')
  const goToPricing = () => router.push('/pricing')

  const faqs = [
    { q:"What's the difference between Pro and Ultra?", a:"Pro gives you 45 messages per week — ideal for daily coding tasks. Ultra gives you unlimited messages with no weekly cap, perfect for intensive development or teams shipping fast." },
    { q:"How do I upgrade from Pro to Ultra?", a:"Go to the chat sidebar and click 'Manage Subscription'. From there, cancel your Pro plan and purchase an Ultra plan. Your Pro access continues until the end of your current billing period." },
    { q:"Can I cancel my subscription anytime?", a:"Yes, anytime. Click 'Manage Subscription' in the chat sidebar. You'll keep access until the end of your billing period — no immediate cutoff." },
    { q:"Do you offer refunds?", a:"We offer refunds within 7 days of purchase if you're not satisfied. Contact us at vextarhq@gmail.com with your order details and we'll process it promptly." },
    { q:"When do my weekly messages reset?", a:"Message counts reset every Monday at 00:00 UTC for all plans. Free users get 15 messages, Pro users get 45, Ultra users have no limit." },
    { q:"What happens when I reach my message limit?", a:"You'll see a notification and won't be able to send more messages until the Monday reset. You can upgrade at any time to get more messages immediately." },
    { q:"What AI model does Vextar use?", a:"Vextar is powered by DeepSeek V4 Pro — a state-of-the-art model optimized specifically for code generation, refactoring, and technical problem solving." },
    { q:"Can Vextar generate complete, copy-paste ready code?", a:"Yes. Vextar is designed to produce complete, production-ready files — not just snippets. Copy and paste directly into your project without modification." },
    { q:"Is there a free trial?", a:"Yes. The Free plan gives you 15 messages per week at no cost — no credit card required. Upgrade whenever you're ready." },
    { q:"Can I use the same account on multiple devices?", a:"Yes. Your Vextar account and conversation history sync across all devices. Log in from any browser and pick up where you left off." },
  ]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #060810; --bg2: #0b0f1a; --surface: rgba(255,255,255,0.03);
          --border: rgba(255,255,255,0.07); --border-bright: rgba(107,184,212,0.25);
          --accent: #6bb8d4; --accent2: #4a9ab8; --accent-glow: rgba(107,184,212,0.15);
          --text: #e8edf2; --text-dim: rgba(232,237,242,0.45); --text-faint: rgba(232,237,242,0.2);
        }
        html { scroll-behavior: smooth; }
        body { background:var(--bg); color:var(--text); font-family:'Share Tech Mono',monospace; overflow-x:hidden; cursor:none; -webkit-font-smoothing:antialiased; }
        body::before { content:''; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.025; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:180px 180px; }
        .cursor { position:fixed; z-index:9999; pointer-events:none; width:4px; height:4px; border-radius:50%; background:var(--accent); transform:translate(-50%,-50%); box-shadow:0 0 8px var(--accent); }
        .cursor-ring { position:fixed; z-index:9998; pointer-events:none; width:24px; height:24px; border-radius:50%; border:1px solid rgba(107,184,212,0.5); transform:translate(-50%,-50%); transition:width .4s cubic-bezier(.4,0,.2,1),height .4s cubic-bezier(.4,0,.2,1); }
        .cursor-ring.grow { width:48px; height:48px; border-color:rgba(107,184,212,0.3); }
        nav { position:fixed; top:0; left:0; right:0; z-index:100; height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 56px; border-bottom:1px solid var(--border); background:rgba(6,8,16,0.85); backdrop-filter:blur(20px); }
        .nav-brand { display:flex; align-items:center; gap:12px; text-decoration:none; opacity:0; animation:fadeIn .8s ease .1s forwards; }
        .nav-brand img { height:30px; width:auto; }
        .nav-wordmark { font-family:'Rajdhani',sans-serif; font-size:20px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:var(--text); }
        .nav-wordmark span { color:var(--accent); }
        .nav-links { display:flex; gap:40px; list-style:none; opacity:0; animation:fadeIn .8s ease .25s forwards; }
        .nav-links a { font-size:11px; letter-spacing:.15em; text-transform:uppercase; color:var(--text-dim); text-decoration:none; transition:color .2s; }
        .nav-links a:hover { color:var(--accent); }
        .nav-cta { opacity:0; animation:fadeIn .8s ease .4s forwards; }
        .btn-primary { font-family:'Share Tech Mono',monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase; color:var(--bg); background:var(--accent); padding:10px 24px; border:none; cursor:none; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:opacity .2s,box-shadow .2s; clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px)); }
        .btn-primary:hover { opacity:.85; box-shadow:0 0 24px var(--accent-glow); }
        .btn-ghost { font-family:'Share Tech Mono',monospace; font-size:12px; letter-spacing:.1em; text-transform:uppercase; color:var(--text-dim); background:transparent; padding:10px 24px; border:1px solid var(--border); cursor:none; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:color .2s,border-color .2s; clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px)); }
        .btn-ghost:hover { color:var(--accent); border-color:var(--border-bright); }
        .hero { min-height:100vh; display:flex; flex-direction:column; justify-content:center; padding:60px 56px 0; position:relative; overflow:hidden; }
        .hero-orb { position:absolute; top:-20%; right:-10%; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle,rgba(107,184,212,0.06) 0%,transparent 65%); animation:orbPulse 8s ease-in-out infinite; pointer-events:none; }
        .hero-orb2 { position:absolute; bottom:-30%; left:-15%; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(107,184,212,0.04) 0%,transparent 65%); animation:orbPulse 10s ease-in-out 2s infinite; pointer-events:none; }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.15);opacity:1} }
        .hero::after { content:''; position:absolute; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--accent),transparent); opacity:.3; animation:scanLine 6s linear infinite; }
        @keyframes scanLine { 0%{top:-1px;opacity:0} 10%{opacity:.3} 90%{opacity:.3} 100%{top:100%;opacity:0} }
        .hero-status { display:flex; align-items:center; gap:10px; font-size:11px; letter-spacing:.15em; text-transform:uppercase; color:var(--accent); margin-bottom:48px; opacity:0; animation:fadeUp .8s ease .5s forwards; }
        .status-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); box-shadow:0 0 8px var(--accent); animation:blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.4} }
        .hero-title { font-family:'Rajdhani',sans-serif; font-size:clamp(64px,10vw,140px); font-weight:700; line-height:.88; letter-spacing:-.01em; text-transform:uppercase; color:var(--text); margin-bottom:12px; opacity:0; animation:fadeUp .9s ease .6s forwards; }
        .hero-title-accent { font-family:'Rajdhani',sans-serif; font-size:clamp(64px,10vw,140px); font-weight:300; line-height:.88; letter-spacing:-.01em; text-transform:uppercase; color:transparent; -webkit-text-stroke:1px rgba(107,184,212,0.5); display:block; margin-bottom:40px; opacity:0; animation:fadeUp .9s ease .7s forwards; }
        .hero-sub { font-size:14px; color:var(--text-dim); line-height:1.8; max-width:400px; margin-bottom:48px; opacity:0; animation:fadeUp .9s ease .8s forwards; }
        .hero-actions { display:flex; gap:14px; align-items:center; opacity:0; animation:fadeUp .9s ease .95s forwards; }
        .terminal { position:absolute; right:56px; top:50%; transform:translateY(-50%); width:420px; background:var(--bg2); border:1px solid var(--border); opacity:0; animation:fadeLeft 1s ease 1.1s forwards; }
        .terminal::before { content:''; position:absolute; inset:-1px; background:linear-gradient(135deg,var(--border-bright),transparent 60%); pointer-events:none; z-index:-1; }
        .term-bar { display:flex; align-items:center; gap:8px; padding:12px 16px; border-bottom:1px solid var(--border); background:rgba(255,255,255,.02); }
        .term-dot { width:8px; height:8px; border-radius:50%; }
        .td1{background:#ff5f57} .td2{background:#febc2e} .td3{background:#28c840}
        .term-title { font-size:10px; letter-spacing:.1em; color:var(--text-faint); margin-left:8px; text-transform:uppercase; }
        .term-body { padding:20px 20px 24px; }
        pre.code { font-family:'Share Tech Mono',monospace; font-size:12px; line-height:1.85; color:var(--text-dim); }
        .ck{color:var(--accent)} .cf{color:#a78bfa} .cs{color:#86efac} .cc{color:var(--text-faint)}
        .blink { display:inline-block; width:7px; height:14px; background:var(--accent); vertical-align:middle; animation:blink 1s step-end infinite; }
        .divider { height:1px; background:var(--border); position:relative; overflow:visible; }
        .divider::after { content:''; position:absolute; left:0; top:0; width:120px; height:1px; background:linear-gradient(90deg,var(--accent),transparent); }
        .powered-bar { display:flex; align-items:center; justify-content:center; gap:16px; padding:18px 56px; border-bottom:1px solid var(--border); background:rgba(107,184,212,0.03); }
        .powered-dot { width:5px; height:5px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); }
        .powered-text { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--text-dim); }
        .powered-text span { color:var(--accent); }
        .metrics { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--border); }
        .metric { padding:52px 48px; border-right:1px solid var(--border); position:relative; overflow:hidden; }
        .metric:last-child { border-right:none; }
        .metric::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,var(--accent),transparent); transform:scaleX(0); transform-origin:left; transition:transform .6s ease; }
        .metric.in::before { transform:scaleX(1); }
        .metric-val { font-family:'Rajdhani',sans-serif; font-size:56px; font-weight:700; line-height:1; color:var(--text); margin-bottom:8px; letter-spacing:-.02em; }
        .metric-label { font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--text-dim); }
        .section { padding:96px 56px; position:relative; }
        .section-label { display:flex; align-items:center; gap:16px; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--accent); margin-bottom:40px; }
        .section-label::before { content:''; display:block; width:32px; height:1px; background:var(--accent); }
        .section-label::after { content:''; flex:1; height:1px; background:var(--border); }
        .section-title { font-family:'Rajdhani',sans-serif; font-size:clamp(36px,5vw,64px); font-weight:700; letter-spacing:.02em; text-transform:uppercase; line-height:.95; color:var(--text); }
        .section-title em { color:var(--accent); font-style:normal; }
        .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); margin-top:64px; }
        .feat { background:var(--bg); padding:44px 36px; position:relative; overflow:hidden; transition:background .3s; }
        .feat::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,var(--accent),transparent); transform:scaleX(0); transform-origin:left; transition:transform .4s ease; }
        .feat:hover { background:var(--bg2); }
        .feat:hover::after { transform:scaleX(1); }
        .feat-id { font-size:10px; letter-spacing:.15em; color:var(--text-faint); margin-bottom:28px; display:block; }
        .feat-icon { width:36px; height:36px; margin-bottom:20px; border:1px solid var(--border-bright); display:flex; align-items:center; justify-content:center; }
        .feat-icon svg { width:16px; height:16px; stroke:var(--accent); fill:none; stroke-width:1.5; }
        .feat-title { font-family:'Rajdhani',sans-serif; font-size:20px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; color:var(--text); margin-bottom:12px; }
        .feat-desc { font-size:12px; color:var(--text-dim); line-height:1.8; }
        .process-section { background:var(--bg2); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
        .process-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); border:1px solid var(--border); margin-top:64px; }
        .proc { background:var(--bg2); padding:44px 36px; position:relative; }
        .proc-num { font-family:'Rajdhani',sans-serif; font-size:72px; font-weight:700; color:rgba(255,255,255,.04); line-height:1; margin-bottom:20px; letter-spacing:-.02em; }
        .proc-title { font-family:'Rajdhani',sans-serif; font-size:18px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--accent); margin-bottom:10px; }
        .proc-desc { font-size:12px; color:var(--text-dim); line-height:1.8; }
        .proc-arrow { position:absolute; top:44px; right:-13px; width:26px; height:26px; z-index:1; clip-path:polygon(0 0,100% 50%,0 100%); background:var(--accent); }
        .proc:last-child .proc-arrow { display:none; }
        .view-plans-bar { display:flex; align-items:center; justify-content:center; gap:24px; padding:48px 56px; background:var(--bg2); border-bottom:1px solid var(--border); }
        .view-plans-text { font-family:'Rajdhani',sans-serif; font-size:20px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--text-dim); }
        .cta-section { padding:120px 56px; text-align:center; position:relative; overflow:hidden; }
        .cta-section::before { content:''; position:absolute; bottom:-200px; left:50%; transform:translateX(-50%); width:800px; height:800px; border-radius:50%; background:radial-gradient(circle,rgba(107,184,212,0.07) 0%,transparent 65%); pointer-events:none; }
        .cta-title { font-family:'Rajdhani',sans-serif; font-size:clamp(48px,8vw,110px); font-weight:700; text-transform:uppercase; letter-spacing:.02em; line-height:.9; color:var(--text); margin-bottom:10px; position:relative; }
        .cta-title-ghost { font-family:'Rajdhani',sans-serif; font-size:clamp(48px,8vw,110px); font-weight:700; text-transform:uppercase; letter-spacing:.02em; line-height:.9; color:transparent; -webkit-text-stroke:1px rgba(107,184,212,0.3); margin-bottom:40px; position:relative; }
        .cta-sub { font-size:13px; color:var(--text-dim); max-width:360px; margin:0 auto 48px; line-height:1.8; position:relative; }
        .cta-hint { margin-top:14px; font-size:10px; letter-spacing:.08em; color:var(--text-faint); text-transform:uppercase; position:relative; }
        .faq-section { padding:96px 56px; border-top:1px solid var(--border); background:var(--bg2); }
        .faq-grid { margin-top:64px; border:1px solid var(--border); }
        .faq-item { border-bottom:1px solid var(--border); position:relative; }
        .faq-item:last-child { border-bottom:none; }
        .faq-item::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,var(--accent),transparent); transform:scaleX(0); transform-origin:left; transition:transform .4s ease; }
        .faq-item.open::before { transform:scaleX(1); }
        .faq-q { width:100%; background:transparent; border:none; padding:28px 36px; display:flex; align-items:center; justify-content:space-between; gap:24px; cursor:pointer; text-align:left; transition:background .2s; }
        .faq-q:hover { background:rgba(107,184,212,0.03); }
        .faq-q-text { font-family:'Rajdhani',sans-serif; font-size:18px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:var(--text); }
        .faq-icon { width:20px; height:20px; flex-shrink:0; border:1px solid var(--border-bright); display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:14px; transition:transform .3s,background .2s; }
        .faq-item.open .faq-icon { transform:rotate(45deg); background:var(--accent-glow); }
        .faq-a { max-height:0; overflow:hidden; transition:max-height .35s ease,padding .35s ease; padding:0 36px; }
        .faq-item.open .faq-a { max-height:200px; padding:0 36px 28px; }
        .faq-a-text { font-size:13px; color:var(--text-dim); line-height:1.9; border-left:2px solid var(--border-bright); padding-left:16px; }
        footer { border-top:1px solid var(--border); padding:32px 56px; display:flex; align-items:center; justify-content:space-between; }
        .f-wordmark { font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:var(--text-dim); }
        .f-wordmark span { color:var(--accent); }
        .f-links { display:flex; gap:28px; }
        .f-links a { font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--text-faint); text-decoration:none; transition:color .2s; }
        .f-links a:hover { color:var(--accent); }
        .f-copy { font-size:10px; letter-spacing:.06em; color:var(--text-faint); }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft { from{opacity:0;transform:translateY(-50%) translateX(40px)} to{opacity:1;transform:translateY(-50%) translateX(0)} }
        .reveal { opacity:0; transform:translateY(18px); transition:opacity .7s ease,transform .7s ease; }
        .reveal.in { opacity:1; transform:none; }
        @media(max-width:1100px){ .terminal{display:none} }
        @media(max-width:900px){
          nav{padding:0 24px} .nav-links{display:none}
          .hero{padding:60px 24px 0} .features-grid{grid-template-columns:1fr 1fr}
          .process-grid{grid-template-columns:1fr 1fr} .metrics{grid-template-columns:1fr 1fr}
          .section,.cta-section,.faq-section{padding:64px 24px}
          footer{flex-direction:column;gap:16px;text-align:center;padding:28px 24px}
          .view-plans-bar{flex-direction:column;padding:32px 24px;gap:16px}
          .powered-bar{padding:18px 24px}
          .faq-q{padding:20px} .faq-a{padding:0 20px} .faq-item.open .faq-a{padding:0 20px 20px}
        }
        @media(max-width:580px){ .features-grid,.process-grid,.metrics{grid-template-columns:1fr} }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" />

      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>

      <nav>
        <a href="#" className="nav-brand">
          <span className="nav-wordmark"><span>V</span>EXTAR</span>
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="nav-cta">
          <button className="btn-primary" onClick={goToLogin}>Access Beta</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-orb"></div>
        <div className="hero-orb2"></div>
        <div className="hero-status"><span className="status-dot"></span>Powered by DeepSeek</div>
        <div className="hero-title">Code at the<br/>speed of</div>
        <span className="hero-title-accent">Thought.</span>
        <p className="hero-sub">AI-powered professional coding intelligence. Generate, refactor, and optimize production-grade code in seconds.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={goToLogin}>Start Building →</button>
          <a href="#process" className="btn-ghost">See Process</a>
        </div>
        <div className="terminal">
          <div className="term-bar">
            <span className="term-dot td1"></span><span className="term-dot td2"></span><span className="term-dot td3"></span>
            <span className="term-title">vextar_output.py</span>
          </div>
          <div className="term-body">
            <pre className="code"><span className="cc"># Vextar AI · 0.8s</span>{`\n\n`}<span className="ck">async def</span> <span className="cf">authenticate_user</span>{`(\n  token: `}<span className="cf">str</span>{`,\n  scopes: `}<span className="cf">list</span>[<span className="cf">str</span>]{`\n) -> `}<span className="cf">AuthResult</span>{`:\n  `}<span className="cs">{`"""JWT validation with\n  rate limiting + audit log."""`}</span>{`\n\n  payload = `}<span className="ck">await</span>{` jwt.verify(\n    token, settings.SECRET\n  )\n\n  `}<span className="ck">if not</span>{` has_scopes(\n    payload, scopes\n  ):\n    `}<span className="ck">raise</span> <span className="cf">PermissionDenied</span>{`()\n\n  `}<span className="ck">return</span> <span className="cf">AuthResult</span>{`(\n    user_id=payload[`}<span className="cs">"sub"</span>{`],\n    scopes=scopes\n  )`}<span className="blink"></span></pre>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <div className="powered-bar reveal">
        <span className="powered-dot"></span>
        <span className="powered-text">Powered by <span>DeepSeek</span> — optimized for professional coding</span>
        <span className="powered-dot"></span>
      </div>

      <div className="metrics">
        <div className="metric reveal"><div className="metric-val" id="m1">—</div><div className="metric-label">Output accuracy</div></div>
        <div className="metric reveal"><div className="metric-val" id="m2">—</div><div className="metric-label">Avg. response time</div></div>
        <div className="metric reveal"><div className="metric-val" id="m3">—</div><div className="metric-label">Languages supported</div></div>
        <div className="metric reveal"><div className="metric-val" id="m4">—</div><div className="metric-label">Active developers</div></div>
      </div>

      <section className="section" id="features">
        <div className="section-label reveal">Capabilities</div>
        <h2 className="section-title reveal">Built for <em>production.</em><br/>Not prototypes.</h2>
        <div className="features-grid">
          {[
            { id:'SYS.01', title:'Code Generation', desc:'Describe in natural language. Receive clean, documented, production-ready code instantly — not snippets.', icon:<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
            { id:'SYS.02', title:'Smart Refactoring', desc:'Analyzes patterns, bottlenecks, and anti-patterns. Modernizes codebases without regressions.', icon:<><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></> },
            { id:'SYS.03', title:'Multi-Stack', desc:'Python, TypeScript, Rust, Go, Swift, Kotlin and 40+ more — with full framework and ecosystem awareness.', icon:<><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></> },
            { id:'SYS.04', title:'Auto Documentation', desc:'Generates docstrings, README files, and API references automatically from your codebase.', icon:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
            { id:'SYS.05', title:'Test Generation', desc:'Full coverage — unit, integration, and edge cases — generated and maintained automatically.', icon:<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></> },
            { id:'SYS.06', title:'IDE Integration', desc:'Native plugins for VS Code, Neovim, and JetBrains. Zero workflow disruption.', icon:<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></> },
          ].map(f => (
            <div className="feat reveal" key={f.id}>
              <span className="feat-id">{f.id}</span>
              <div className="feat-icon"><svg viewBox="0 0 24 24">{f.icon}</svg></div>
              <div className="feat-title">{f.title}</div>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="section-label reveal">Process</div>
        <h2 className="section-title reveal">From idea<br/>to <em>deploy.</em></h2>
        <div className="process-grid">
          {[
            { n:'01', t:'Describe', d:'Write what you need in plain language. No special syntax, no commands to memorize.' },
            { n:'02', t:'Analyze', d:'Vextar reads your project context, stack, patterns, and conventions automatically.' },
            { n:'03', t:'Generate', d:'Clean, tested, documented code — production-ready in under a second.' },
            { n:'04', t:'Iterate', d:"Refine, request alternatives, ask for explanations. Vextar adapts to your thinking." },
          ].map(p => (
            <div className="proc reveal" key={p.n}>
              <div className="proc-num">{p.n}</div>
              <div className="proc-title">{p.t}</div>
              <p className="proc-desc">{p.d}</p>
              <div className="proc-arrow"></div>
            </div>
          ))}
        </div>
      </section>

      <div className="view-plans-bar reveal">
        <span className="view-plans-text">Ready to unlock full access?</span>
        <button className="btn-primary" onClick={goToPricing}>View Plans →</button>
      </div>

      <section className="cta-section" id="pricing">
        <div className="cta-title reveal">Start building</div>
        <div className="cta-title-ghost reveal">with Vextar.</div>
        <p className="cta-sub reveal">No credit card required. 15 free messages per week. Cancel anytime.</p>
        <div className="reveal"><button className="btn-primary" onClick={goToLogin}>Access Now →</button></div>
        <p className="cta-hint reveal">Trusted by 12,000+ developers worldwide</p>
      </section>

      <section className="faq-section" id="faq">
        <div className="section-label reveal">Support</div>
        <h2 className="section-title reveal">Frequently asked <em>questions.</em></h2>
        <div className="faq-grid reveal">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="faq-q-text">{faq.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">
                <p className="faq-a-text">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div className="f-brand">
          <span className="f-wordmark"><span>V</span>EXTAR</span>
        </div>
        <nav className="f-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/refund">Refund</a>
        </nav>
        <span className="f-copy">© 2026 Vextar, Inc.</span>
      </footer>
    </>
  )
}
