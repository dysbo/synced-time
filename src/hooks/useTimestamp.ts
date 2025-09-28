'use client'

import { getTime } from '@/service/time'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export const useTimestamp = () => {
  const searchParams = useSearchParams();
  const [referenceTime, setReferenceTime] = useState<Date | null>(null);
  const [localReceived, setLocalReceived] = useState<number>(0);
  const [time, setTime] = useState<string>();
  const [isLocal, setIsLocal] = useState(true); // start as local
  const [retriesExpired, setRetriesExpired] = useState(false);
  const [pending, setPending] = useState(true); // track if waiting for server

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
        setPending(false);
      } catch (e) {
        if (attempt < maxRetries) {
          setTimeout(() => fetchReferenceTime(attempt + 1), retryDelay);
        } else {
          setReferenceTime(null);
          setLocalReceived(Date.now());
          setIsLocal(true);
          setRetriesExpired(true);
          setPending(false);
        }
      }
    };
    void fetchReferenceTime();
  }, [fps]);

  useEffect(() => {
    // Always update time, using local if referenceTime is not set
    const update = () => {
      let now: Date;
      let display: string;
      if (referenceTime && localReceived && !isLocal) {
        const elapsed = Date.now() - localReceived;
        now = new Date(referenceTime.getTime() + elapsed);
        display = getTime(now, fps);
      } else {
        now = new Date();
        display = getTime(now, fps);
        if (pending) display += ' (L, pending)';
        else if (retriesExpired) display += ' (L, retries expired)';
        else display += ' (L)';
      }
      setTime(display);
    };
    update();
    const id = setInterval(update, 1000 / fps);
    return () => clearInterval(id);
  }, [referenceTime, localReceived, fps, isLocal, retriesExpired, pending]);

  return time || '';
}
