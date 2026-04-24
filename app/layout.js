import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'Vextar — AI Code Intelligence',
  description: 'Your AI-powered coding assistant',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
