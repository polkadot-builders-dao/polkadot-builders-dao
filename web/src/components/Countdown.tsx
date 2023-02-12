import { FC, useEffect, useState } from "react"

type CountdownProps = {
  date: Date
}

const formatTimeTo = (date: Date) => {
  const timeRemaining = date.getTime() - Date.now()
  const seconds = Math.floor((timeRemaining / 1000) % 60)
  const minutes = Math.floor((timeRemaining / 1000 / 60) % 60)
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24)
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  else if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  else if (minutes > 0) return `${minutes}m ${seconds}s`
  else return `${seconds}s`
}

export const Countdown: FC<CountdownProps> = ({ date }) => {
  const [display, setDisplay] = useState<string>(() => formatTimeTo(date))

  useEffect(() => {
    const updateDisplay = () => {
      setDisplay(formatTimeTo(date))
    }

    const interval = setInterval(updateDisplay, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [date])

  return date.valueOf() < Date.now() ? null : <>{display}</>
}
