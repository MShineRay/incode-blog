import { useState } from 'react'
import Link from 'next/link'
import cx from 'classnames'
import RoutesEnum from '~/utils/RoutesEnum'
import useMobileDetect from '~/utils/useMobileDetect'
import Logo from '~/components/Logo'
import BurgerMenu from '~/components/BurgerMenu'
import styles from './Header.module.scss'
import iconArrow from '~/public/images/arrow-small.svg'

const useCaseSubmenu = [
  {
    title: 'All Use Cases',
    link: RoutesEnum.USE_CASES,
  },
  {
    title: 'Finance',
    link: RoutesEnum.FINANCE,
  },
  {
    title: 'Hospitality',
    link: RoutesEnum.HOSPITALITY,
  },
  {
    title: 'Transportation',
    link: RoutesEnum.TRANSPORTATION,
  },
  {
    title: 'Retail',
    link: RoutesEnum.RETAIL,
  },
  {
    title: 'Age Verification',
    link: RoutesEnum.AGE_VERIFICATION,
  },
  {
    title: 'eCommerce',
    link: RoutesEnum.ECOMMERCE,
  },
]
const contactSubmenu = [
  {
    title: 'About Incode',
    link: RoutesEnum.ABOUT,
  },
  {
    title: 'Contact',
    link: RoutesEnum.CONTACT,
  },
  {
    title: 'Careers',
    link: RoutesEnum.CAREERS,
  },
  {
    title: 'Press',
    link: RoutesEnum.PARTNERS,
  },
]

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState('')
  const { isMobile } = useMobileDetect()

  const handleNavbar = () => {
    setNavbarOpen(!navbarOpen)
  }
  const toggleDropdown = id => {
    if (activeDropdown === id) {
      setActiveDropdown('')
      return
    }
    setActiveDropdown(id)
  }

  const NavLinks = () => (
    <>
      <li className={styles.item}>
        <a href={RoutesEnum.OMNI}>Incode Omni Platform</a>
      </li>
      <li className={styles.item}>
        <div
          className={styles.dropdown}
          onClick={() => toggleDropdown('usecases-dropdown')}
        >
          <p
            className={cx({
              [styles.opened]: activeDropdown === 'usecases-dropdown',
            })}
          >
            Use cases
            <img src={iconArrow} alt="submenu icon" />
          </p>
          <ul
            className={cx(styles.content, {
              [styles.opened]: activeDropdown === 'usecases-dropdown',
            })}
          >
            {useCaseSubmenu.map(submenuItem => (
              <Link key={submenuItem.link} href={submenuItem.link}>
                <li>{submenuItem.title}</li>
              </Link>
            ))}
          </ul>
        </div>
      </li>
      <li className={styles.item}>
        <Link href={RoutesEnum.TECHNOLOGY}>Technology</Link>
      </li>
      <li className={styles.item}>
        <div
          className={styles.dropdown}
          onClick={() => toggleDropdown('developers-dropdown')}
        >
          <p
            className={cx({
              [styles.opened]: activeDropdown === 'developers-dropdown',
            })}
          >
            Developers
            <img src={iconArrow} alt="submenu icon" />
          </p>
          <ul
            className={cx(styles.content, {
              [styles.opened]: activeDropdown === 'developers-dropdown',
            })}
          >
            <li>
              <Link href={RoutesEnum.DEVELOPERS}>Devs Brief</Link>
            </li>
            <li>
              <a href={RoutesEnum.OMNI_APIARY} target="_blank" rel="noreferrer">
                API Documentation
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li className={styles.item}>
        <div
          className={styles.dropdown}
          onClick={() => toggleDropdown('company-dropdown')}
        >
          <p
            className={cx({
              [styles.opened]: activeDropdown === 'company-dropdown',
            })}
          >
            Company
            <img src={iconArrow} alt="submenu icon" />
          </p>
          <ul
            className={cx(styles.content, {
              [styles.opened]: activeDropdown === 'company-dropdown',
            })}
          >
            {contactSubmenu.map(submenuItem => (
              <Link key={submenuItem.link} href={submenuItem.link}>
                <li>{submenuItem.title}</li>
              </Link>
            ))}
          </ul>
        </div>
      </li>
    </>
  )

  const DesktopNavigation = () => (
    <ul className={styles.menu}>
      <NavLinks />
    </ul>
  )

  const MobileNavigation = () => (
    <>
      <BurgerMenu handleNavbar={handleNavbar} navbarState={navbarOpen} />
    </>
  )

  return (
    <>
      <header className={styles.header}>
        <Logo />
        {isMobile ? (
          <MobileNavigation />
        ) : (
          <nav className={styles.nav} role="navigation">
            <DesktopNavigation />
          </nav>
        )}
      </header>
      {navbarOpen && (
        <div className={styles.mobile}>
          <ul className={styles.menu}>
            <NavLinks />
          </ul>
          <p className={styles.copy}>
            © Incode Technologies Inc. All rights reserved.
          </p>
        </div>
      )}
    </>
  )
}

export default Header
