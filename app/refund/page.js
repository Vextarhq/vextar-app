export default function Refund() {
  return (
    <main style={{
      maxWidth: '860px', margin: '0 auto', padding: '80px 24px',
      fontFamily: 'monospace', color: '#e0e0e0', background: '#0a0a0a', minHeight: '100vh'
    }}>
      <p style={{color: '#00bcd4', fontSize: '11px', letterSpacing: '4px', marginBottom: '8px'}}>LEGAL — SYS.03</p>
      <h1 style={{fontSize: '42px', fontWeight: 900, color: '#fff', marginBottom: '4px'}}>REFUND POLICY</h1>
      <p style={{color: '#555', fontSize: '12px', marginBottom: '60px'}}>Effective date: May 7, 2026 — Vextar, Inc.</p>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>1. 14-DAY REFUND GUARANTEE</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Vextar offers a full 14-day refund window on all subscription purchases, with no exceptions or conditions. If you are unsatisfied for any reason within 14 days of your purchase, you are entitled to a full refund. No questions asked.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>2. HOW TO REQUEST A REFUND</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>To request a refund, email us at <a href="mailto:support@vextar.org" style={{color: '#00bcd4'}}>support@vextar.org</a> with the subject line <strong style={{color: '#fff'}}>"Refund Request"</strong> within 14 days of your purchase. Include your registered email address and the date of the charge. Approved refunds are processed by Paddle and may take 5–10 business days to appear on your statement.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>3. AFTER 14 DAYS</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Refund requests made after the 14-day window will not be eligible. Subscription renewal charges are not refundable. You may cancel your subscription at any time to avoid future charges.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>4. CANCELLATIONS</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>You may cancel your subscription at any time from your account settings. Upon cancellation, you retain access until the end of your current billing period.</p>
      </section>

      <section style={{marginBottom: '60px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>5. CONTACT</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>For refund requests: <a href="mailto:support@vextar.org" style={{color: '#00bcd4'}}>support@vextar.org</a></p>
      </section>

      <p style={{color: '#333', fontSize: '11px', borderTop: '1px solid #1a1a1a', paddingTop: '20px'}}>© 2026 Vextar, Inc. All rights reserved.</p>
    </main>
  )
}
