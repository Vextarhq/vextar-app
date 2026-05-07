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
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>1. OVERVIEW</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Vextar offers subscription-based access to our AI coding assistant. Because our Service delivers immediate digital value upon activation, we maintain a limited refund policy as described below. All payments are processed by Paddle, our Merchant of Record.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>2. 7-DAY REFUND WINDOW</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>If you are unsatisfied with Vextar for any reason, you may request a full refund within 7 days of your initial subscription payment. To qualify, you must not have made excessive use of the Service during that period. Refund requests made after 7 days will not be eligible unless exceptional circumstances apply.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>3. RENEWAL CHARGES</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Subscription renewals are not refundable. If you do not wish to be charged for a renewal, you must cancel your subscription at least 24 hours before your next billing date. You can cancel at any time from your account settings. After cancellation, you will retain access to the Service until the end of your current billing period.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>4. NON-REFUNDABLE SITUATIONS</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>The following are not eligible for refunds:</p>
        <ul style={{color: '#aaa', lineHeight: '2', paddingLeft: '20px'}}>
          <li>Requests made after the 7-day window</li>
          <li>Subscription renewal charges</li>
          <li>Accounts suspended or terminated due to violations of our Terms of Service</li>
          <li>Partial months or unused portions of a subscription period</li>
          <li>Dissatisfaction with AI-generated output quality</li>
        </ul>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>5. EXCEPTIONS</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>We evaluate exceptional circumstances on a case-by-case basis. If you experienced a technical failure that prevented you from using the Service, or were charged in error, contact us and we will investigate promptly. We are committed to being fair.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>6. HOW TO REQUEST A REFUND</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>To request a refund, email us at <a href="mailto:support@vextar.org" style={{color: '#00bcd4'}}>support@vextar.org</a> with the subject line <strong style={{color: '#fff'}}>"Refund Request"</strong> and include:</p>
        <ul style={{color: '#aaa', lineHeight: '2', paddingLeft: '20px'}}>
          <li>Your registered email address</li>
          <li>The date of the charge</li>
          <li>The reason for your request</li>
        </ul>
        <p style={{lineHeight: '1.8', color: '#aaa', marginTop: '16px'}}>We will respond within 3 business days. Approved refunds are processed by Paddle and may take 5–10 business days to appear on your statement.</p>
      </section>

      <section style={{marginBottom: '60px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>7. CONTACT</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>For any billing or refund questions:<br/>
        <a href="mailto:support@vextar.org" style={{color: '#00bcd4'}}>support@vextar.org</a></p>
      </section>

      <p style={{color: '#333', fontSize: '11px', borderTop: '1px solid #1a1a1a', paddingTop: '20px'}}>© 2026 Vextar, Inc. All rights reserved.</p>
    </main>
  );
}
