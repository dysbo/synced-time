'use client'

import { useEffect, useMemo, useState } from 'react'
import { getTime } from '@/service/time'
import { useSearchParams } from 'next/navigation'

export const useTimestamp = () => {
  const searchParams = useSearchParams();
  const [referenceTime, setReferenceTime] = useState<Date | null>(null);
  const [localReceived, setLocalReceived] = useState<number>(0);
  const [time, setTime] = useState<string>();
  const [isLocal, setIsLocal] = useState(false);

  const fps = useMemo(() => {
    const value = searchParams.get('fps');
    if (value) {
      return parseInt(value, 10)
    }
    return 60
  }, [searchParams])

  useEffect(() => {
    const fetchReferenceTime = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        setLocalReceived(Date.now());
        const data = await response.json();
        setReferenceTime(new Date(data.utc_datetime));
        setIsLocal(false);
      } catch (e) {
        setReferenceTime(new Date());
        setLocalReceived(Date.now());
        setIsLocal(true);
      }
    };
    void fetchReferenceTime();
  }, []);

  useEffect(() => {
    if (!referenceTime || !localReceived) return;
    const update = () => {
      const elapsed = Date.now() - localReceived;
      const now = new Date(referenceTime.getTime() + elapsed);
      let display = getTime(now, fps);
      if (isLocal) display += ' (L)';
      setTime(display);
    };
    update();
    const id = setInterval(update, 1000 / fps);
    return () => clearInterval(id);
  }, [referenceTime, localReceived, fps, isLocal]);

  if (time) return time;
  // fallback: local time, always mark as local
  const now = new Date();
  return getTime(now, fps) + ' (L)';
}
