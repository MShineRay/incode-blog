import Link from 'next/link'
import styles from './Header.module.scss'

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/images/logo.svg" alt="incode logo" />
        </Link>
      </div>
    </div>
  )
}

export default Header
