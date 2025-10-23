import './App.css'
import { useTimer } from './hooks/use-timer'
import { CountdownTimer } from './components/timer-view'
import { MainView } from './components/main-view'
import { formatTime } from './lib/time'
import { useEffect } from 'react'
import { setTrayTitle } from './lib/tray'
import { CompleteView } from './components/complete-view'

function App() {
  const timer = useTimer()

  useEffect(() => {
    setTrayTitle(timer.remainingSeconds > 0 ? formatTime(timer.remainingSeconds) : null)
  }, [timer.remainingSeconds])

  if (timer.view === 'focus' || timer.view === 'rest') {
    return (
      <CountdownTimer
        totalMinutes={timer.totalMinutes}
        view={timer.view}
        isRunning={timer.running}
        remainingSeconds={timer.remainingSeconds}
        onPause={timer.pause}
        onResume={timer.resume}
        onComplete={timer.complete}
        onCancel={timer.cancel}
        updateRemainingSeconds={timer.updateRemainingSeconds}
      />
    )
  }

  if (timer.view === 'complete') {
    return (
      <CompleteView
        completedMinutes={timer.lastCompletedMinutes}
        totalMinutes={timer.totalMinutes}
        onClickRest={timer.takeABreak}
        onClickContinue={timer.keepWorking}
      />
    )
  }

  return <MainView totalMinutes={timer.totalMinutes} onStart={timer.start} onReset={timer.reset} />
}

export default App
