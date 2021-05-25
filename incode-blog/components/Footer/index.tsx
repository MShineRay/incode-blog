import Link from 'next/link'
import RoutesEnum from '~/utils/RoutesEnum'
import Logo from '~/components/Logo'
import styles from './Footer.module.scss'
import socImg from '~/public/images/soc.svg'
const legalSubmenu = [
  {
    title: 'Privacy Policy',
    link: RoutesEnum.PRIVACY,
  },
  {
    title: 'POC',
    link: RoutesEnum.POC,
  },
  {
    title: 'Terms of Use',
    link: RoutesEnum.TERMS,
  },
]
const useCaseSubmenu = [
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
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <div className={styles.footer_top}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.top_menu}>
            <ul className={styles.item}>
              <a href={RoutesEnum.OMNI}>Incode Omni Platform</a>
            </ul>
            <ul className={styles.item}>
              <a href={RoutesEnum.USE_CASES}>Use Cases</a>
              {useCaseSubmenu.map(submenuItem => (
                <Link key={submenuItem.link} href={submenuItem.link}>
                  <li>{submenuItem.title}</li>
                </Link>
              ))}
            </ul>
            <ul className={styles.item}>
              <a href={RoutesEnum.TECHNOLOGY}>Technology</a>
            </ul>
            <ul className={styles.item}>
              <a href={RoutesEnum.DEVELOPERS}>Developers</a>
              <Link href={RoutesEnum.OMNI_APIARY}>
                <li>API Documentation</li>
              </Link>
            </ul>
            <ul className={styles.item}>
              <a href={RoutesEnum.ABOUT}>Company</a>
              {contactSubmenu.map(submenuItem => (
                <Link key={submenuItem.link} href={submenuItem.link}>
                  <li>{submenuItem.title}</li>
                </Link>
              ))}
            </ul>
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
