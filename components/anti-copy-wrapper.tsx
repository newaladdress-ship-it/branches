'use client'

import { useEffect } from 'react'
import { initializeAntiCopy } from '@/lib/anti-copy'

export default function AntiCopyWrapper() {
  useEffect(() => {
    initializeAntiCopy()
  }, [])

  return null
}
