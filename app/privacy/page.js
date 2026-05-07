export default function Privacy() {
  return (
    <main style={{
      maxWidth: '860px', margin: '0 auto', padding: '80px 24px',
      fontFamily: 'monospace', color: '#e0e0e0', background: '#0a0a0a', minHeight: '100vh'
    }}>
      <p style={{color: '#00bcd4', fontSize: '11px', letterSpacing: '4px', marginBottom: '8px'}}>LEGAL — SYS.02</p>
      <h1 style={{fontSize: '42px', fontWeight: 900, color: '#fff', marginBottom: '4px'}}>PRIVACY POLICY</h1>
      <p style={{color: '#555', fontSize: '12px', marginBottom: '60px'}}>Effective date: May 7, 2026 — Vextar, Inc.</p>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>1. INTRODUCTION</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Vextar, Inc. ("Vextar", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our Service at vextar.org. By using Vextar, you agree to the practices described in this policy.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>2. INFORMATION WE COLLECT</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>We collect the following categories of information:</p>
        <ul style={{color: '#aaa', lineHeight: '2', paddingLeft: '20px'}}>
          <li><strong style={{color: '#fff'}}>Account information:</strong> Your name, email address, and authentication data provided during registration via Clerk.</li>
          <li><strong style={{color: '#fff'}}>Conversation data:</strong> The prompts and messages you send to Vextar, along with the AI-generated responses. These are stored securely in our database (Supabase) to provide conversation history.</li>
          <li><strong style={{color: '#fff'}}>Payment information:</strong> Billing and payment data is collected and processed exclusively by Paddle, our Merchant of Record. Vextar does not store your credit card or banking details.</li>
          <li><strong style={{color: '#fff'}}>Usage data:</strong> Technical information such as your IP address, browser type, device type, and pages visited, collected automatically when you use the Service.</li>
        </ul>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>3. HOW WE USE YOUR INFORMATION</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>We use your information exclusively to:</p>
        <ul style={{color: '#aaa', lineHeight: '2', paddingLeft: '20px'}}>
          <li>Provide, maintain, and improve the Vextar Service</li>
          <li>Store and display your conversation history</li>
          <li>Process payments and manage your subscription</li>
          <li>Send transactional emails (account confirmation, billing receipts)</li>
          <li>Detect and prevent abuse, fraud, or violations of our Terms</li>
          <li>Respond to your support requests</li>
        </ul>
        <p style={{lineHeight: '1.8', color: '#aaa', marginTop: '16px'}}>We do not sell your personal data to third parties. We do not use your data for advertising purposes.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>4. AI PROCESSING & YOUR CONVERSATIONS</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Vextar uses Claude, an AI model developed by Anthropic, to process your coding requests. When you send a message, your prompt is transmitted to Anthropic's API to generate a response. Anthropic's own privacy policy and data handling practices apply to this processing. We recommend reviewing Anthropic's privacy policy at <a href="https://www.anthropic.com/privacy" style={{color: '#00bcd4'}}>anthropic.com/privacy</a>.</p>
        <p style={{lineHeight: '1.8', color: '#aaa', marginTop: '16px'}}>Your conversation history is stored in our secure database (Supabase) and is accessible only to you through your account. We do not use your conversations to train AI models.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>5. DATA STORAGE & SECURITY</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Your data is stored securely using Supabase, which employs industry-standard encryption at rest and in transit (TLS/SSL). Access to your data is restricted to authenticated sessions only. We implement technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>
        <p style={{lineHeight: '1.8', color: '#aaa', marginTop: '16px'}}>Despite our efforts, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>6. THIRD-PARTY SERVICES</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Vextar integrates with the following third-party services, each governed by their own privacy policies:</p>
        <ul style={{color: '#aaa', lineHeight: '2', paddingLeft: '20px'}}>
          <li><strong style={{color: '#fff'}}>Clerk</strong> — Authentication and user management. <a href="https://clerk.com/privacy" style={{color: '#00bcd4'}}>clerk.com/privacy</a></li>
          <li><strong style={{color: '#fff'}}>Supabase</strong> — Database and storage. <a href="https://supabase.com/privacy" style={{color: '#00bcd4'}}>supabase.com/privacy</a></li>
          <li><strong style={{color: '#fff'}}>Paddle</strong> — Payment processing and subscription management. <a href="https://www.paddle.com/legal/privacy" style={{color: '#00bcd4'}}>paddle.com/legal/privacy</a></li>
          <li><strong style={{color: '#fff'}}>Anthropic (Claude)</strong> — AI model provider. <a href="https://www.anthropic.com/privacy" style={{color: '#00bcd4'}}>anthropic.com/privacy</a></li>
          <li><strong style={{color: '#fff'}}>Vercel</strong> — Hosting and deployment. <a href="https://vercel.com/legal/privacy-policy" style={{color: '#00bcd4'}}>vercel.com/legal/privacy-policy</a></li>
        </ul>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>7. COOKIES</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Vextar uses only essential cookies required for authentication and session management (provided by Clerk). We do not use tracking cookies, advertising cookies, or third-party analytics cookies. You can control cookie settings through your browser, but disabling essential cookies may prevent you from using the Service.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>8. DATA RETENTION</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>We retain your account data and conversation history for as long as your account is active. If you delete your account, we will delete your personal data and conversation history within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>9. YOUR RIGHTS</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
        <ul style={{color: '#aaa', lineHeight: '2', paddingLeft: '20px'}}>
          <li><strong style={{color: '#fff'}}>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong style={{color: '#fff'}}>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong style={{color: '#fff'}}>Deletion:</strong> Request deletion of your personal data ("right to be forgotten").</li>
          <li><strong style={{color: '#fff'}}>Portability:</strong> Request your data in a machine-readable format.</li>
          <li><strong style={{color: '#fff'}}>Objection:</strong> Object to certain types of processing of your data.</li>
        </ul>
        <p style={{lineHeight: '1.8', color: '#aaa', marginTop: '16px'}}>To exercise any of these rights, contact us at <a href="mailto:support@vextar.org" style={{color: '#00bcd4'}}>support@vextar.org</a>. We will respond within 30 days.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>10. CHILDREN'S PRIVACY</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>Vextar is not intended for users under the age of 16. We do not knowingly collect personal data from children. If we become aware that a child has provided us with personal data, we will delete it immediately.</p>
      </section>

      <section style={{marginBottom: '40px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>11. CHANGES TO THIS POLICY</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice. The effective date at the top of this page will always reflect the most recent version. Continued use of the Service after changes constitutes your acceptance of the updated policy.</p>
      </section>

      <section style={{marginBottom: '60px'}}>
        <h2 style={{color: '#00bcd4', fontSize: '13px', letterSpacing: '3px'}}>12. CONTACT</h2>
        <p style={{lineHeight: '1.8', color: '#aaa'}}>For privacy-related questions or to exercise your rights, contact us at:<br/>
        <a href="mailto:support@vextar.org" style={{color: '#00bcd4'}}>support@vextar.org</a></p>
      </section>

      <p style={{color: '#333', fontSize: '11px', borderTop: '1px solid #1a1a1a', paddingTop: '20px'}}>© 2026 Vextar, Inc. All rights reserved.</p>
    </main>
  );
}
