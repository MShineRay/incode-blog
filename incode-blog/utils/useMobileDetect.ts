import { useEffect, useState } from 'react'
// Utils
import RegexEnum from './RegexEnum'

export default function useMobileDetect() {
  const [isMobile, setMobile] = useState(false)
  useEffect(() => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent
    const mobile = Boolean(userAgent.match(RegexEnum.MOBILE_PATTERN))
    setMobile(mobile)
  }, [])
  return { isMobile }
}