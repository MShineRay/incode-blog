import { motion } from 'framer-motion'
import Meta from '~/components/Meta/Meta'
import Header from '~/components/Header/Header'
import CTASection from '~/components/CTASection/CTASection'

type LayoutProps = {
  children: React.ReactNode
  pageTitle: string
  description?: string
  currentURL?: string
  ogImage?: string
}

const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle,
  description,
  currentURL,
  ogImage,
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
    <Header />
    <div className="content">{children}</div>
    <CTASection />
  </motion.div>
)

export default Layout
