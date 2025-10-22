import { cn } from '@/lib/utils'
import React from 'react'

export const ShortcutText: React.FC<{
  text: string
  className?: string
}> = ({ text, className }) => {
  return <span className={cn('font-mono', className)}>({text})</span>
}
