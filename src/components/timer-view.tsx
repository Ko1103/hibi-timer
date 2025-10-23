'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CircleDotIcon, CoffeeIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'
import { ShortcutText } from './shortcut-text'
import { timeToStr } from '@/lib/time'

const noop = () => {}

export const CountdownTimer: React.FC<{
  view: 'focus' | 'rest'
  isRunning: boolean
  remainingSeconds: number
  onPause: () => void
  onResume: () => void
  onComplete: () => void
  onCancel: () => void
  updateRemainingSeconds: (seconds: number) => void
  totalMinutes: number
}> = ({
  view,
  isRunning,
  remainingSeconds,
  onPause,
  onResume,
  onComplete,
  onCancel,
  updateRemainingSeconds,
  totalMinutes,
}) => {
  const isFocus = view === 'focus'

  useEffect(() => {
    if (!isRunning) {
      return noop
    }

    if (remainingSeconds <= 0) {
      onComplete()
      return noop
    }

    const interval = setInterval(() => {
      updateRemainingSeconds(remainingSeconds - 1)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isRunning, remainingSeconds, onComplete, updateRemainingSeconds])

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }, [])

  const handleConfirmCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  const handlePause = useCallback(() => {
    if (isRunning) {
      onPause()
    } else {
      onResume()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!document.hasFocus()) {
        return
      }

      const isSpace = event.code === 'Space' || event.key === ' '
      const isEscape = event.key === 'Escape' || event.code === 'Escape'
      const isSkip = event.metaKey && (event.key === 'ArrowRight' || event.code === 'ArrowRight')

      if (!isSpace && !isEscape && !isSkip) {
        return
      }

      if (isEscape) {
        handleConfirmCancel()
        return
      }

      if (isSpace) {
        event.preventDefault()
        handlePause()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleConfirmCancel, handlePause])

  return (
    <div
      className={cn(
        'min-h-screen max-h-screen w-full flex flex-col',
        isFocus ? 'bg-background text-muted-foreground' : 'bg-emerald-500 text-white'
      )}
    >
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'text-muted-foreground rounded-full ',
                isFocus ? 'text-muted-foreground' : 'text-white'
              )}
              onClick={handleConfirmCancel}
            >
              <XIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Cancel <ShortcutText text="Esc" />
          </TooltipContent>
        </Tooltip>
      </div>

      <main className="flex-1">
        <div className="flex flex-col gap-4 px-4 mt-15">
          <div
            className={cn(
              'flex items-center justify-center gap-2 text-center text-lg text-muted-foreground',
              isFocus ? 'text-muted-foreground' : 'text-muted'
            )}
          >
            {isFocus ? (
              <>
                <span>Focus</span>
                <CircleDotIcon className="size-6" />
              </>
            ) : (
              <>
                <span>Let&apos;s take a break</span>
                <CoffeeIcon className="size-6" />
              </>
            )}
          </div>
          <div className="w-full">
            <div className="flex flex-col items-center gap-8">
              {/* Timer Display */}
              {/* Time Text */}
              <div className="flex items-center justify-center">
                <span
                  className={cn(
                    'font-mono text-4xl font-bold tracking-wider text-foreground tabular-nums',
                    isFocus ? 'text-foreground' : 'text-muted'
                  )}
                >
                  {formatTime(remainingSeconds)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="rounded-full" onClick={handlePause}>
                  {isRunning ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRunning ? 'Pause' : 'Resume'} <ShortcutText text="Space" />
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </main>

      <footer className="w-full px-3 py-2">
        <span className="text-sm">Total: {timeToStr(totalMinutes * 60)}</span>
      </footer>
    </div>
  )
}
