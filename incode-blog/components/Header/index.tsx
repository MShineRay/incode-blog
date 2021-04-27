import Link from 'next/link'
import styles from './Header.module.scss'
import logo from '~/public/images/logo.svg'

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img src={logo} alt="incode logo" />
        </Link>
      </div>
    </div>
  )
}

export default Header
