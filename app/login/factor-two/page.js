'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function FactorTwo() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/chat')
  }, [])
  return null
}
