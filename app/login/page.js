import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <SignIn afterSignInUrl="/app" afterSignUpUrl="/app" />
    </div>
  )
}
