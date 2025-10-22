import './App.css'
import { useTimer } from './hooks/use-timer'
import { CountdownTimer } from './components/timer-view'
import { MainView } from './components/main-view'

function App() {
  const timer = useTimer()
  const first = timer.timers[0] ?? null

  if (first) {
    return (
      <CountdownTimer
        timer={first}
        nextTimer={timer.timers[1]}
        onComplete={timer.onFinish}
        onCancel={timer.cancel}
        onSkip={timer.skipRest}
      />
    )
  }

  return <MainView totalMinutes={timer.totalMinutes} setTimer={timer.setTimer} />
}

export default App
