import { motion } from 'framer-motion'
import Meta from '~/components/Meta'
import Header from '~/components/Header'
import CTASection from '~/components/CTASection'
import Subsribe from '~/components/Subscribe'
import CookieBanner from '~/components/CookieBanner'
import Footer from '~/components/Footer'

type LayoutProps = {
  children: React.ReactNode
  pageTitle: string
  description?: string
  currentURL?: string
  ogImage?: string
  isFullPage?: boolean
}

const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle,
  description,
  currentURL,
  ogImage,
  isFullPage = false,
}: LayoutProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }}
  >
    <Meta
      pageTitle={pageTitle}
      description={description}
      currentURL={currentURL}
      ogImage={ogImage}
    />
    {!isFullPage && <Header />}
    <main className="content">{children}</main>
    {!isFullPage && (
      <>
        <Subsribe />
        <CTASection />
        <CookieBanner />
        <Footer />
      </>
    )}
  </motion.div>
)

export default Layout
