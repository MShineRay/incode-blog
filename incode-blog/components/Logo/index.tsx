import Link from 'next/link'
import logo from '~/public/images/logo.svg'
import styles from './Logo.module.scss'

const Logo = () => (
  <div className={styles.logo}>
    <Link href="/">
      <img src={logo} alt="incode logo" />
    </Link>
  </div>
)

export default Logo
