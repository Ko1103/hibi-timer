import { showWindow } from '@/lib/window'
import { useState } from 'react'

// const electron =
//   typeof window !== 'undefined' && window.electron ? window.electron : null;

export type TimerMode = 'focus' | 'rest' | 'select'

export type TimerSet = {
  mode: TimerMode
  minutes: number
}

export function useTimer() {
  // 1日の合計時間(分)
  const [view, setView] = useState<'select' | 'focus' | 'rest'>('select')
  const [totalMinutes, setTotalMinutes] = useState(0)
  // 実行中の時間(分)
  const [runningMinutes, setRunningMinutes] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  // タイマーの開始（フォーカスか休憩)
  const start = (minutes: number, mode: 'focus' | 'rest') => {
    setView(mode)

    // タイマーの初期設定
    setRunningMinutes(minutes)
    setRemainingSeconds(minutes * 60)
    setRunning(true)
  }

  // 一時停止
  const pause = () => {
    setRunning(false)
  }

  // 再開
  const resume = () => {
    setRunning(true)
  }

  // キャンセル
  const cancel = () => {
    setView('select')
    // 途中までの時間を合計時間に加算
    if (view === 'focus') {
      const focusedMinutes = runningMinutes - Math.floor(remainingSeconds / 60)
      setTotalMinutes(totalMinutes + focusedMinutes)
    }
    _resetRunning()
  }

  const complete = () => {
    // 合計時間を更新
    if (view === 'focus') {
      setTotalMinutes(totalMinutes + runningMinutes)
    }
    setView('select')
    _resetRunning()

    showWindow().then(() => {})
  }

  const _resetRunning = () => {
    setRunning(false)
    setRunningMinutes(0)
    setRemainingSeconds(0)
  }

  const updateRemainingSeconds = (seconds: number) => {
    setRemainingSeconds(seconds)
  }

  //　合計時間をリセット
  const reset = () => {
    setTotalMinutes(0)
  }

  return {
    view,
    totalMinutes,
    runningMinutes,
    remainingSeconds,
    running,
    start,
    pause,
    resume,
    cancel,
    complete,
    updateRemainingSeconds,
    reset,
  }
}
