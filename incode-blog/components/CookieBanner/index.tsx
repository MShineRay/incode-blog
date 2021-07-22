import { useEffect, useState } from 'react'
import cookieCutter from 'cookie-cutter'
import Link from 'next/link'
import RoutesEnum from '~/utils/RoutesEnum'
import styles from './CookieBanner.module.scss'

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    const hasAccepted = cookieCutter.get('cookieConsent')
    if (hasAccepted) setShowBanner(false)
  }, [])

  const onCookieAccept = () => {
    cookieCutter.set('cookieConsent', true)
    setShowBanner(false)
  }

  const CookieBannerInfo = () => (
    <div className={styles.cookie_banner_container}>
      <div>
        <p>
          This website uses cookies to ensure you get the best experience on our
          website. For a more detailed description how the site uses cookies,
          please read our
          <Link href={RoutesEnum.COOKIES}> Cookie Policy</Link>
        </p>
        <button onClick={onCookieAccept}>Accept and close</button>
      </div>
    </div>
  )

  return showBanner ? <CookieBannerInfo /> : null
}

export default CookieBanner
