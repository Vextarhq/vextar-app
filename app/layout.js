import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'Vextar — AI Code Intelligence',
  description: 'Your AI-powered coding assistant',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignInUrl="/chat" afterSignUpUrl="/chat">
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
