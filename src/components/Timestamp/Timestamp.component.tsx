'use client'

import styles from './Timestamp.module.css'
import { useTimestamp } from '@/hooks'

export const Timestamp = () => {
  const time = useTimestamp();

  return (
    <div className={styles.timestamp}>
      {time}
    </div>
  )
}
