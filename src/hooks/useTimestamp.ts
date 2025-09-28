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
  const [retriesExpired, setRetriesExpired] = useState(false);

  const fps = useMemo(() => {
    const value = searchParams.get('fps');
    if (value) {
      return parseInt(value, 10)
    }
    return 60
  }, [searchParams])

  useEffect(() => {
    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds
    const fetchReferenceTime = async (attempt = 1) => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        setLocalReceived(Date.now());
        const data = await response.json();
        setReferenceTime(new Date(data.utc_datetime));
        setIsLocal(false);
        setRetriesExpired(false);
      } catch (e) {
        if (attempt < maxRetries) {
          setTimeout(() => fetchReferenceTime(attempt + 1), retryDelay);
        } else {
          setReferenceTime(new Date());
          setLocalReceived(Date.now());
          setIsLocal(true);
          setRetriesExpired(true);
        }
      }
    };
    void fetchReferenceTime();
  }, [fps]);

  useEffect(() => {
    if (!referenceTime || !localReceived) return;
    const update = () => {
      const elapsed = Date.now() - localReceived;
      const now = new Date(referenceTime.getTime() + elapsed);
      let display = getTime(now, fps);
      if (isLocal && retriesExpired) display += ' (L, retries expired)';
      else if (isLocal) display += ' (L)';
      setTime(display);
    };
    update();
    const id = setInterval(update, 1000 / fps);
    return () => clearInterval(id);
  }, [referenceTime, localReceived, fps, isLocal, retriesExpired]);

  if (time) return time;
  // fallback: local time, always mark as local
  const now = new Date();
  return getTime(now, fps) + (retriesExpired ? ' (L, retries expired)' : ' (L)');
}
