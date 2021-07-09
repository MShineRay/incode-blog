import Link from 'next/link'
import Layout from '~/components/Layout'
import styles from '~/styles/CustomError.module.scss'
const Custom404 = () => {
  return (
    <Layout pageTitle="Incode - 404" isFullPage>
      <div className={styles.incd_custom_404}>
        <div className={styles.incd_custom_404_content}>
          <h1>Oops, page not found</h1>
          <p>404</p>
          <Link href="/" passHref>
            <a>
              <button>Go back</button>
            </a>
          </Link>
          <img src={'/images/custom-404.svg'} alt="404 not found" />
        </div>
      </div>
    </Layout>
  )
}

export default Custom404
