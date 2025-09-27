import styles from './page.module.css'
import { Timestamp } from '@/components'
import { Suspense } from 'react'

export default function Home() {

  return (
    <div className={styles.page}>
      <Suspense fallback={null}>
        <Timestamp />
      </Suspense>
    </div>
  );
}
