'use client'
import { useAuth, useSignIn } from '@clerk/nextjs'
import { useState } from 'react'

export default function LoginPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { signIn, isLoaded, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      const result = await signIn.create({
        identifier: email,
        password
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        window.location.href = 'https://www.vextar.org/chat'
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Email o contraseña incorrectos')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        width: '360px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>Sign in to Vextar</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Welcome back! Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
            />
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
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
  Don't have an account? <a href="/sign-up" style={{ color: '#111', fontWeight: '600' }}>Sign up</a>
</p>
<p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
  <a href="/forgot-password" style={{ color: '#111', fontWeight: '600' }}>Forgot password?</a>
</p>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>Secured by Clerk</p>
      </div>
    </div>
  )
}
