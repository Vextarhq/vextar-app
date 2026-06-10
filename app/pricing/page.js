'use client'
import { useAuth } from '@clerk/nextjs'

const PRO_MONTHLY_URL = 'https://vextar.lemonsqueezy.com/checkout/buy/622ad0d8-a652-48e2-bd9c-bc6ec00827f6'
const PRO_YEARLY_URL = 'https://vextar.lemonsqueezy.com/checkout/buy/fb7944c4-5b8c-4176-bcaa-89197257b344'
const ULTRA_MONTHLY_URL = 'https://vextar.lemonsqueezy.com/checkout/buy/4a6ac901-142d-4d63-a34a-deaf5bd11fd0'
const ULTRA_YEARLY_URL = 'https://vextar.lemonsqueezy.com/checkout/buy/52dd227d-807c-4d54-b528-2c0e580e41d0'

export default function PricingPage() {
  const { userId } = useAuth()

  function handleCheckout(url) {
    if (!userId) {
      window.location.href = '/login'
      return
    }
    window.location.href = `${url}?checkout[custom][user_id]=${userId}`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060810; color: #e8edf2; font-family: 'Share Tech Mono', monospace; }
        .pricing-page { min-height: 100vh; background: #060810; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; }
        .pricing-label { color: #6bb8d4; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px; }
        .pricing-title { font-family: 'Rajdhani', sans-serif; font-size: 52px; font-weight: 900; text-transform: uppercase; color: #fff; text-align: center; margin-bottom: 8px; }
        .pricing-title span { color: #6bb8d4; }
        .pricing-sub { color: rgba(232,237,242,0.5); font-size: 13px; letter-spacing: 2px; text-align: center; margin-bottom: 60px; }
        .plans { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
        .plan { background: #0b0f1a; border: 1px solid rgba(255,255,255,0.07); padding: 40px 36px; width: 300px; position: relative; clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); }
        .plan.featured { border-color: rgba(107,184,212,0.4); }
        .plan.featured::before { content: 'MOST POPULAR'; position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: #6bb8d4; color: #060810; font-size: 9px; letter-spacing: 3px; padding: 4px 16px; }
        .plan.ultra { border-color: rgba(212,175,55,0.4); }
        .plan.ultra::before { content: 'BEST VALUE'; position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: #d4af37; color: #060810; font-size: 9px; letter-spacing: 3px; padding: 4px 16px; }
        .plan-name { font-family: 'Rajdhani', sans-serif; font-size: 14px; letter-spacing: 4px; text-transform: uppercase; color: rgba(232,237,242,0.5); margin-bottom: 16px; }
        .plan-price { font-family: 'Rajdhani', sans-serif; font-size: 56px; font-weight: 900; color: #fff; line-height: 1; margin-bottom: 4px; }
        .plan-price span { font-size: 20px; color: rgba(232,237,242,0.5); }
        .plan-period { font-size: 11px; color: rgba(232,237,242,0.4); letter-spacing: 2px; margin-bottom: 8px; }
        .plan-save { font-size: 11px; color: #6bb8d4; letter-spacing: 2px; margin-bottom: 32px; min-height: 20px; }
        .plan-save.gold { color: #d4af37; }
        .plan-features { list-style: none; margin-bottom: 36px; display: flex; flex-direction: column; gap: 12px; }
        .plan-features li { font-size: 12px; color: rgba(232,237,242,0.7); display: flex; gap: 10px; align-items: flex-start; }
        .plan-features li::before { content: '→'; color: #6bb8d4; flex-shrink: 0; }
        .plan.ultra .plan-features li::before { color: #d4af37; }
        .plan-btn { width: 100%; background: transparent; color: #6bb8d4; border: 1px solid rgba(107,184,212,0.4); padding: 14px; font-family: 'Share Tech Mono', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all .2s; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); }
        .plan-btn:hover { background: rgba(107,184,212,0.1); box-shadow: 0 0 20px rgba(107,184,212,0.15); }
        .plan-btn.primary { background: #6bb8d4; color: #060810; border-color: #6bb8d4; }
        .plan-btn.primary:hover { opacity: .9; box-shadow: 0 0 24px rgba(107,184,212,0.3); }
        .plan-btn.gold { background: #d4af37; color: #060810; border-color: #d4af37; }
        .plan-btn.gold:hover { opacity: .9; box-shadow: 0 0 24px rgba(212,175,55,0.3); }
        .toggle-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(232,237,242,0.5); }
        .toggle { position: relative; width: 44px; height: 24px; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; inset: 0; background: rgba(255,255,255,0.1); border: 1px solid rgba(107,184,212,0.3); transition: .3s; border-radius: 24px; }
        .slider::before { content: ''; position: absolute; height: 16px; width: 16px; left: 3px; bottom: 3px; background: #6bb8d4; transition: .3s; border-radius: 50%; }
        input:checked + .slider { background: rgba(107,184,212,0.2); }
        input:checked + .slider::before { transform: translateX(20px); }
        .active-period { color: #6bb8d4; }
        .back-link { margin-top: 40px; color: rgba(232,237,242,0.3); font-size: 11px; letter-spacing: 2px; cursor: pointer; text-decoration: none; transition: color .2s; }
        .back-link:hover { color: #6bb8d4; }
        @media(max-width: 700px) { .plans { flex-direction: column; align-items: center; } }
      `}</style>

      <div className="pricing-page">
        <p className="pricing-label">Upgrade</p>
        <h1 className="pricing-title">Choose your <span>plan</span></h1>
        <p className="pricing-sub">Unlock the full power of Vextar AI</p>

        <div className="plans">

          {/* FREE */}
          <div className="plan">
            <p className="plan-name">Free</p>
            <div className="plan-price">$0<span>/mo</span></div>
            <p className="plan-period">Forever free</p>
            <p className="plan-save"> </p>
            <ul className="plan-features">
              <li>15 messages per week</li>
              <li>DeepSeek-powered responses</li>
              <li>Full conversation history</li>
              <li>Basic support</li>
            </ul>
            <button className="plan-btn" onClick={() => window.location.href = '/chat'}>
              Start free →
            </button>
          </div>

          {/* PRO MONTHLY */}
          <div className="plan featured">
            <p className="plan-name">Pro</p>
            <div className="plan-price">$15<span>/mo</span></div>
            <p className="plan-period">Billed monthly</p>
            <p className="plan-save"> </p>
            <ul className="plan-features">
              <li>80 messages per week</li>
              <li>DeepSeek-powered responses</li>
              <li>Full conversation history</li>
              <li>Priority support</li>
            </ul>
            <button className="plan-btn primary" onClick={() => handleCheckout(PRO_MONTHLY_URL)}>
              Get started →
            </button>
          </div>

          {/* PRO ANNUAL */}
          <div className="plan">
            <p className="plan-name">Pro Annual</p>
            <div className="plan-price">$10<span>/mo</span></div>
            <p className="plan-period">Billed $120/year</p>
            <p className="plan-save">Save 33% vs monthly</p>
            <ul className="plan-features">
              <li>80 messages per week</li>
              <li>DeepSeek-powered responses</li>
              <li>Full conversation history</li>
              <li>Priority support</li>
            </ul>
            <button className="plan-btn" onClick={() => handleCheckout(PRO_YEARLY_URL)}>
              Get started →
            </button>
          </div>

          {/* ULTRA MONTHLY */}
          <div className="plan ultra">
            <p className="plan-name">Ultra</p>
            <div className="plan-price">$45<span>/mo</span></div>
            <p className="plan-period">Billed monthly</p>
            <p className="plan-save gold"> </p>
            <ul className="plan-features">
              <li>Unlimited messages</li>
              <li>DeepSeek-powered responses</li>
              <li>Full conversation history</li>
              <li>Priority support</li>
            </ul>
            <button className="plan-btn gold" onClick={() => handleCheckout(ULTRA_MONTHLY_URL)}>
              Get Ultra →
            </button>
          </div>

          {/* ULTRA ANNUAL */}
          <div className="plan ultra">
            <p className="plan-name">Ultra Annual</p>
            <div className="plan-price">$33<span>/mo</span></div>
            <p className="plan-period">Billed $396/year</p>
            <p className="plan-save gold">Save 27% vs monthly</p>
            <ul className="plan-features">
              <li>Unlimited messages</li>
              <li>DeepSeek-powered responses</li>
              <li>Full conversation history</li>
              <li>Priority support</li>
            </ul>
            <button className="plan-btn gold" onClick={() => handleCheckout(ULTRA_YEARLY_URL)}>
              Get Ultra →
            </button>
          </div>

        </div>

        <a className="back-link" href="/chat">← Back to chat</a>
      </div>
    </>
  )
}
