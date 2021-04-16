import { motion } from 'framer-motion'
import Meta from '~/components/Meta/Meta'

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
}) => (
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
    <div className="incd-site-container">
      <div className="content">{children}</div>
    </div>
  </motion.div>
)

export default Layout
