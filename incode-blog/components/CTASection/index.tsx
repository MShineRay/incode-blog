import { useRouter } from 'next/router'
import RoutesEnum from '~/utils/RoutesEnum'
import styles from './CTASection.module.scss'

const CTASection = () => {
  const router = useRouter()
  return (
    <div className={styles.cta}>
      <button onClick={() => router.push(RoutesEnum.CONTACT)}>
        Let&apos;s get in touch
      </button>
    </div>
  )
}

export default CTASection
