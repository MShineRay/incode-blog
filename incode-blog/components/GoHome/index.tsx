import Link from 'next/link'
import arrowLeft from '~/public/images/arrow-left.svg'
import styles from './GoHome.module.scss'

const GoHome = () => (
  <div className={styles.goback}>
    <Link href="/">
      <a>
        <img src={arrowLeft} alt="arrow left" />
        Blog
      </a>
    </Link>
  </div>
)

export default GoHome
