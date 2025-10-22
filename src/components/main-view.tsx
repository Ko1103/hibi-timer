'use client'

import { ShortcutText } from './shortcut-text'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Timer } from '@/hooks/use-timer'
import { cn } from '@/lib/utils'
import { CircleQuestionMarkIcon, PlayIcon } from 'lucide-react'
import React from 'react'
import { TimerLayout } from './timer-layout'
import { TimerFooter } from './timer-footer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const TimeButton: React.FC<{
  minutes: number
  shortcut: string
  className?: string
  onClick: () => void
}> = ({ minutes, shortcut, className, onClick }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            'text-muted bg-emerald-300 text-base size-20 flex flex-col items-center justify-center gap-1',
            className
          )}
          onClick={onClick}
        >
          <span className="text-lg font-bold">{minutes}:00</span>
          <PlayIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {minutes} minutes timer
        <br />
        <ShortcutText text={shortcut} />
      </TooltipContent>
    </Tooltip>
  )
}

export const MainView: React.FC<{
  totalMinutes: number
  setTimer: (timer: Timer[]) => void
}> = ({ totalMinutes, setTimer }) => {
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60
  const formattedHours = totalHours.toString().padStart(2, '0')
  const formattedMinutes = remainingMinutes.toString().padStart(2, '0')

  // 共通のプリセット定義
  const presets: Record<string, Timer[]> = React.useMemo(
    () => ({
      '1': [
        { mode: 'focus', minutes: 5 },
        { mode: 'rest', minutes: 5 },
      ],
      '2': [
        { mode: 'focus', minutes: 15 },
        { mode: 'rest', minutes: 5 },
      ],
      '3': [
        { mode: 'focus', minutes: 30 },
        { mode: 'rest', minutes: 5 },
      ],
      '4': [
        { mode: 'focus', minutes: 60 },
        { mode: 'rest', minutes: 5 },
      ],
    }),
    []
  )

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!document.hasFocus()) {
        return
      }

      const isMetaOnly = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey

      if (!isMetaOnly) {
        return
      }

      const timers = presets[event.key]

      if (!timers) {
        return
      }

      event.preventDefault()
      setTimer(timers)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setTimer, presets])

  return (
    <TimerLayout className="flex flex-col">
      <div className="flex justify-end px-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <CircleQuestionMarkIcon className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-base">Keyboard Shortcuts</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Show/Hide</div>
              <ShortcutText text="⌘ + E" />
              <div>Start timer</div>
              <ShortcutText text="⌘ + number" />
              <div>Pause/Resume</div>
              <ShortcutText text="Space" />
              <div>Skip</div>
              <ShortcutText text="⌘ + →" />
              <div>Cancel</div>
              <ShortcutText text="Esc" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-6 px-4">
        <div className="grid grid-cols-4 gap-4 w-8/10 mx-auto">
          <TimeButton
            minutes={5}
            shortcut="⌘ + 1"
            className="bg-emerald-300"
            onClick={() => setTimer(presets['1'])}
          />
          <TimeButton
            minutes={15}
            shortcut="⌘ + 2"
            className="bg-emerald-500"
            onClick={() => setTimer(presets['2'])}
          />

          <TimeButton
            minutes={30}
            shortcut="⌘ + 3"
            className="bg-emerald-700"
            onClick={() => setTimer(presets['3'])}
          />
          <TimeButton
            minutes={60}
            shortcut="⌘ + 4"
            className="bg-emerald-900"
            onClick={() => setTimer(presets['4'])}
          />
        </div>
      </div>

      <TimerFooter className="flex justify-between text-muted-foreground">
        {/* 何時間何分 */}
        <div>
          {formattedHours} : {formattedMinutes}
        </div>
      </TimerFooter>
    </TimerLayout>
  )
}
