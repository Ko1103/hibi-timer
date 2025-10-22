import { useCallback, useMemo, useRef, useState } from 'react'
import { setTrayDisplay } from '@/lib/tray'

// const electron =
//   typeof window !== 'undefined' && window.electron ? window.electron : null;

export type TimerMode = 'focus' | 'rest'

export type Timer = {
  mode: TimerMode
  minutes: number
}

type TimerStatus = {
  secondsLeft: number
  running: boolean
}

export function useTimer() {
  // タイマーのリスト
  const [timers, setTimers] = useState<Timer[]>([])
  // 1日の合計時間(分)
  const [totalMinutes, setTotalMinutes] = useState(0)
  // 目標時間(時間)
  const [goalHours, setGoalHours] = useState<number | null>(null)
  const remainingGoalHours = goalHours ? goalHours - totalMinutes / 60 : null
  const [status, setStatus] = useState<TimerStatus>({ secondsLeft: 0, running: false })
  const statusRef = useRef(status)

  const updateTray = useCallback((next: TimerStatus) => {
    statusRef.current = next
    setStatus(next)

    if (!next.running || next.secondsLeft <= 0) {
      setTrayDisplay('--:--')
      return
    }

    const minutes = Math.floor(next.secondsLeft / 60)
    const seconds = next.secondsLeft % 60
    const label = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    setTrayDisplay(label)
  }, [])

  // タイマーをセットする（複数も可能)
  const setTimer = (timerSets: Timer[]) => {
    setTimers(timerSets)
    if (timerSets.length === 0) {
      updateTray({ secondsLeft: 0, running: false })
    }
  }

  // タイマーを終了
  const onFinish = () => {
    const first = timers[0] ?? null
    if (first === null) return

    // 合計時間を更新
    let minutes = first.minutes ?? 0
    if (first.mode === 'rest') {
      minutes = 0
    }
    setTotalMinutes((prev) => prev + minutes)

    // 次のタイマーをセット
    if (timers.length > 0) {
      const nextTimers = timers.slice(1)
      setTimer(nextTimers)
    } else {
      setTimer([])
    }

    updateTray({ secondsLeft: 0, running: false })
  }

  // キャンセル
  const cancel = () => {
    setTimers([])
    updateTray({ secondsLeft: 0, running: false })
  }

  // 一時停止
  const pause = () => {
    // 何もしない
  }

  const setGoal = (hours: number) => {
    setGoalHours(hours)
  }

  // 休憩をスキップして次のタイマーを開始
  const skipRest = () => {
    const first = timers[0]
    if (first.mode === 'rest') {
      const nextTimers = timers.slice(1)
      if (nextTimers.length > 0) {
        setTimer(nextTimers)
      } else {
        setTimer([])
      }
    }
  }

  const setActiveTimerState = useCallback(
    (seconds: number, running: boolean) => {
      updateTray({ secondsLeft: seconds, running })
    },
    [updateTray]
  )

  const derived = useMemo(
    () => ({
      secondsLeft: status.secondsLeft,
      running: status.running,
    }),
    [status]
  )

  return {
    timers,
    totalMinutes,
    goalHours,
    remainingGoalHours,
    onFinish,
    setTimer,
    cancel,
    pause,
    setGoal,
    skipRest,
    setActiveTimerState,
    timerStatus: derived,
  }
}
