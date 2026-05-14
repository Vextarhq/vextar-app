'use client'
import { useAuth, useSignUp } from '@clerk/nextjs'
import { useState } from 'react'

export default function SignUpPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { signUp, isLoaded, setActive } = useSignUp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')

  if (authLoaded && isSignedIn) {
    window.location.href = 'https://www.vextar.org/chat'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      await signUp.create({ emailAddress: email, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setVerifying(true)
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Error al crear cuenta')
    }
    setLoading(false)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        window.location.href = 'https://www.vextar.org/chat'
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Código incorrecto')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>Create your account</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Welcome! Please fill in the details to get started</p>
        </div>

        {!verifying ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '13px' }}>
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            {error && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: '8px', background: '#111', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              {loading ? 'Cargando...' : 'Continue →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>We sent a code to {email}</p>
            <input type="text" placeholder="Verification code" value={code} onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
            {error && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: '8px', background: '#111', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              {loading ? 'Verificando...' : 'Verify →'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
          Already have an account? <a href="/login" style={{ color: '#111', fontWeight: '600' }}>Sign in</a>
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>Secured by Clerk</p>
      </div>
    </div>
  )
}
