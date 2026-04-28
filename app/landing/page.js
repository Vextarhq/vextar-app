import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#060810', color: '#e8edf2', fontFamily: 'monospace' }}>
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2035' }}>
        <h1 style={{ margin: 0, color: '#7c6aff', fontSize: '24px' }}>Vextar</h1>
        <Link href="/login" style={{ background: '#7c6aff', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none' }}>Iniciar sesión</Link>
      </nav>
      <div style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center', padding: '0 20px' }}>
        <h2 style={{ fontSize: '48px', margin: '0 0 20px 0', lineHeight: 1.2 }}>Tu asistente de <span style={{ color: '#7c6aff' }}>código con IA</span></h2>
        <p style={{ fontSize: '18px', color: '#8892a4', marginBottom: '40px' }}>Vextar genera código limpio y listo para producción en cualquier lenguaje. Rápido, preciso y profesional.</p>
        <Link href="/login" style={{ background: '#7c6aff', color: 'white', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontSize: '18px' }}>Empezar gratis →</Link>
      </div>
    </div>
  )
}
