import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.scss'
import logo from '~/public/images/logo.svg'
import socImg from '~/public/images/soc.svg'
const legalSubmenu = [
  {
    title: 'Privacy Policy',
    link: 'https://incode.com/incode-privacy-policy/',
  },
  {
    title: 'POC',
    link: 'https://incode.com/proof-of-concept/',
  },
  {
    title: 'Terms of Use',
    link: 'https://incode.com/incode-terms-of-use/',
  },
]
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div className={styles.footer_top}>
          <div className={styles.logo}>
            <img src={logo} alt="incode logo" />
          </div>
        </div>
        <hr />
        <div className={styles.footer_bottom}>
          <ul className={styles.bottom_menu}>
            {legalSubmenu.map(submenuItem => (
              <li key={submenuItem.link}>
                <Link href={submenuItem.link}>{submenuItem.title}</Link>
              </li>
            ))}
          </ul>
          <div className={styles.bottom_info}>
            <img src={socImg} alt="soc certification logo" />
            <p className={styles.small}>
              Incode Technologies has been certified to be SOC 2 Compliant.
            </p>
            <p className={styles.small}>
              Incode Technologies uses 256-bit SSL encryption 100% of the time
              on every device.
            </p>
            <p className={styles.copy}>
              © Incode Technologies Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
