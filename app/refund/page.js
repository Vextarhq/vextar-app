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
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>1. NO-REFUND POLICY</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>All purchases and subscription payments made through Vextar are final and non-refundable. By completing a purchase, you acknowledge and agree that you are not entitled to a refund, credit, or exchange for any reason, including but not limited to: change of mind, dissatisfaction with AI-generated output, or failure to cancel before a renewal date.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>2. DIGITAL SERVICE</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Vextar provides immediate access to a digital SaaS product upon payment. Because access to the Service is granted instantly and the digital nature of the product makes it impossible to "return," all sales are final. This is consistent with standard digital goods and SaaS industry practices.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>3. CANCELLATIONS</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>You may cancel your subscription at any time from your account settings. Upon cancellation, you will retain access to the Service until the end of your current billing period. No partial refunds are issued for unused time remaining in a billing cycle.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>4. BILLING ERRORS</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>The only exception to this policy is in the case of a verified billing error or unauthorized charge. If you believe you were charged incorrectly, contact us within 7 days at <a href="mailto:support@vextar.org" style={{color: '#00bcd4'}}>support@vextar.org</a> and we will investigate. Any decision made by Vextar regarding billing disputes is final.</p>
      </section>

      <section style={{marginBottom: '60px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>5. CONTACT</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>For billing questions contact us at:<br/>
        <a href="mailto:support@vextar.org" style={{color: '#00bcd4'}}>support@vextar.org</a></p>
      </section>

      <p style={{color: '#333', fontSize: '11px', borderTop: '1px solid #1a1a1a', paddingTop: '20px'}}>© 2026 Vextar, Inc. All rights reserved.</p>
    </main>
  );
}
