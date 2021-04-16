import { AppProps } from 'next/app'
import { AnimatePresence } from 'framer-motion'
import '~/styles/globals.scss'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <Component {...pageProps} />
    </AnimatePresence>
  )
}

export default MyApp
