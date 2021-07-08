import { useRouter } from 'next/router'
import styles from './CTASection.module.scss'

const CTASection = () => {
  const router = useRouter()
  return (
    <div className={styles.cta}>
      <button onClick={() => router.push('https://incode.com/contact/')}>
        Let&apos;s get in touch
      </button>
    </div>
  )
}

export default CTASection
