'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CircleDotIcon, CoffeeIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'
import { ShortcutText } from './shortcut-text'

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
}> = ({
  view,
  isRunning,
  remainingSeconds,
  onPause,
  onResume,
  onComplete,
  onCancel,
  updateRemainingSeconds,
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
        'flex min-h-screen max-h-screen w-full flex-col',
        isFocus ? 'bg-muted text-muted-foreground' : 'bg-emerald-500 text-white'
      )}
    >
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
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

        {/* {timer.mode === 'rest' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'rounded-full text-muted-foreground',
                  isFocus ? 'text-muted-foreground' : 'text-muted'
                )}
                onClick={handleSkip}
              >
                <SkipForwardIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Skip <ShortcutText text="⌘ + →" />
            </TooltipContent>
          </Tooltip>
        )} */}
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-6">
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

      <footer className="w-full px-3 py-2"></footer>
    </div>
  )
}
