'use client'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FactorOne() {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoaded) return
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'password',
        password
      })
      if (result.status === 'complete') {
        router.push('/app')
      }
    } catch (err) {
      setError('Contraseña incorrecta')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
        <h2 style={{ textAlign: 'center' }}>Ingresá tu contraseña</h2>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f1318', color: 'white' }}
        />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button type="submit" style={{ padding: '12px', borderRadius: '8px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }}>
          Continuar
        </button>
      </form>
    </div>
  )
}
