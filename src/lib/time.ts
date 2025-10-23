import ms from 'ms'
/**
 *
 * @param seconds
 * @returns HH:MM:SS
 */
export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const timeToStr = (seconds: number) => {
  if (seconds === 0) return '0s'
  return ms(seconds * 1000) // i.e. "1h 2m 3s"
}

export const timeToLongStr = (seconds: number) => {
  if (seconds === 0) return '0s'
  return ms(seconds * 1000, { long: true }) // i.e. "1 hour 2 minutes 3 seconds"
}
