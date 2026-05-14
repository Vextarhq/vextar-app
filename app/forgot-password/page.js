'use client'
import { useSignIn } from '@clerk/nextjs'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState('')
  const [step, setStep] = useState('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email
      })
      setStep('verify')
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Email no encontrado')
    }
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password
      })
      if (result.status === 'complete') {
        window.location.href = 'https://www.vextar.org/chat'
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Código incorrecto o contraseña inválida')
    }
    setLoading(false)
  }

  const containerStyle = {
    minHeight: '100vh',
    background: '#060810',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '360px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box'
  }

  const buttonStyle = {
    padding: '10px',
    borderRadius: '8px',
    background: '#111',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>Reset your password</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
            {step === 'email' ? 'Enter your email to receive a reset code' : 'Enter the code and your new password'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            {error && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Enviando...' : 'Send code →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="Verification code" value={code}
              onChange={(e) => setCode(e.target.value)} style={inputStyle} />
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '40px' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '13px' }}>
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            {error && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? 'Actualizando...' : 'Reset password →'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
          Remember your password? <a href="/login" style={{ color: '#111', fontWeight: '600' }}>Sign in</a>
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>Secured by Clerk</p>
      </div>
    </div>
  )
}
