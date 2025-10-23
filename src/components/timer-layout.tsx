import { cn } from '@/lib/utils'
import React from 'react'
import { ThemeProvider } from './theme-provider'

export const TimerLayout: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className={cn('min-h-screen w-full max-w-md mx-auto bg-background font-mono', className)}
      >
        {children}
      </div>
    </ThemeProvider>
  )
}
