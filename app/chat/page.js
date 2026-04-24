import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function ChatPage() {
  const { userId } = auth()
  if (!userId) redirect('/login')
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      color: '#e8edf2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace'
    }}>
      <h1>Vextar Chat</h1>
    </div>
  )
}
