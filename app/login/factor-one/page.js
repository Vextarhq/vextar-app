'use client'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FactorOne() {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'password',
        password
      })
      if (result.status === 'complete') {
        router.push('/chat')
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Contraseña incorrecta')
    }
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
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                fontSize: '13px'
              }}
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>

          {error && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

          <button type="submit" style={{
            padding: '10px',
            borderRadius: '8px',
            background: '#111',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Continue →
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>Secured by Clerk</p>
      </div>
    </div>
  )
}
