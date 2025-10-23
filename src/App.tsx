import './App.css'
import { useTimer } from './hooks/use-timer'
import { CountdownTimer } from './components/timer-view'
import { MainView } from './components/main-view'
import { formatTime } from './lib/time'
import { useEffect } from 'react'
import { setTrayTitle } from './lib/tray'

function App() {
  const timer = useTimer()

  useEffect(() => {
    setTrayTitle(timer.remainingSeconds > 0 ? formatTime(timer.remainingSeconds) : null)
  }, [timer.remainingSeconds])

  if (timer.view === 'focus' || timer.view === 'rest') {
    return (
      <CountdownTimer
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

  return <MainView totalMinutes={timer.totalMinutes} onStart={timer.start} onReset={timer.reset} />
}

export default App
