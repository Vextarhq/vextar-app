'use client'
import { useEffect } from 'react'

export default function FactorOne() {
  useEffect(() => {
    window.location.href = '/chat'
  }, [])
  return null
}
