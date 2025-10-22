import { cn } from '@/lib/utils'
import React from 'react'

export const TimerLayout: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen w-full max-w-md mx-auto bg-muted', className)}>{children}</div>
  )
}
