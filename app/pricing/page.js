'use client'
import { useAuth } from '@clerk/nextjs'

const MONTHLY_URL = 'https://vextar.lemonsqueezy.com/checkout/buy/622ad0d8-a652-48e2-bd9c-bc6ec00827f6'
const YEARLY_URL = 'https://vextar.lemonsqueezy.com/checkout/buy/fb7944c4-5b8c-4176-bcaa-89197257b344'

export default function PricingPage() {
  const { userId } = useAuth()

  function handleCheckout(url) {
    if (!userId) {
      window.location.href = '/login'
      return
    }
    window.location.href = `${url}?checkout[custom][userId]=${userId}`
  }

  // ... resto del JSX igual, solo cambia los botones:
  // onClick={() => handleCheckout(MONTHLY_URL)}
  // onClick={() => handleCheckout(YEARLY_URL)}
}
