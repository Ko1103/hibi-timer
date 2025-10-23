import React from 'react'
import { timeToStr } from '@/lib/time'
import { ShortcutText } from './shortcut-text'
import { Button } from './ui/button'
import { TimerLayout } from './timer-layout'

export const CompleteView: React.FC<{
  completedMinutes: number
  totalMinutes: number
  onClickRest: () => void
  onClickContinue: () => void
}> = ({ completedMinutes, totalMinutes, onClickRest, onClickContinue }) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!document.hasFocus()) {
        return
      }

      const isMetaOnly = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey

      if (!isMetaOnly || event.key !== 'Enter') {
        return
      }

      event.preventDefault()
      onClickContinue()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClickContinue])

  return (
    <TimerLayout>
      <div className="flex flex-col items-center gap-4 mt-25">
        <div className="space-y-2">
          <div className="text-2xl text-center">Well done! 👍</div>
          <div className="text-lg text-center">
            Total: <span className="text-3xl ">{timeToStr(totalMinutes * 60)}</span> (
            <span className="text-primary">+</span> {completedMinutes} minutes)
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button onClick={onClickRest} variant="secondary">
            Take a break
          </Button>
          <Button onClick={onClickContinue}>
            Continue <ShortcutText text="⌘ + ↩︎" />
          </Button>
        </div>
      </div>
    </TimerLayout>
  )
}
