import { cn } from '@/lib/utils'
import React from 'react'

export const TimerFooter: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return <footer className={cn('mt-auto w-full px-3 py-2', className)}>{children}</footer>
}
