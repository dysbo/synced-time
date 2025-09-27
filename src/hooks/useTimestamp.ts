'use client'

import { useEffect, useMemo, useState } from 'react'
import { getTime } from '@/service/time'
import { useSearchParams } from 'next/navigation'

export const useTimestamp = () => {
  const searchParams = useSearchParams();
  const [time, setTime] = useState<string>()

  const fps = useMemo(() => {
    const value = searchParams.get('fps');
    if (value) {
      return parseInt(value, 10)
    }

    return 60
  }, [searchParams])

  useEffect(() => {
    const update = () => setTime(getTime(fps))
    update()
    const id = setInterval(update, 1000 / fps)

    return () => {
      clearInterval(id)
    }
  }, [fps])

  return time ?? new Date().toLocaleTimeString()
}
