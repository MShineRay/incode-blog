import { useEffect, useState } from 'react'
import RegexEnum from './RegexEnum'

export default function useMobileDetect() {
  const [isMobile, setMobile] = useState(false)
  useEffect(() => {
    let isMounted = true
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent
    const mobile = Boolean(userAgent.match(RegexEnum.MOBILE_PATTERN))
    if (isMounted) {
      setMobile(mobile)
    }
    return () => {
      isMounted = false
    }
  }, [])
  return { isMobile }
}