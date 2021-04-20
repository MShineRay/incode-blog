import { useRouter } from 'next/router'
import Layout from '~/components/Layout/Layout'
import styles from '~/styles/CustomError.module.scss'
const Custom404 = () => {
  const router = useRouter()
  return (
    <Layout pageTitle="Incode - 404">
      <div className={styles.incd_custom_404}>
        <div className={styles.incd_custom_404_content}>
          <h1>Oops, page not found</h1>
          <p>404</p>
          <button onClick={() => router.push('/')}>Go back</button>
          <img src={'/images/custom-404.svg'} alt="404 not found" />
        </div>
      </div>
    </Layout>
  )
}

export default Custom404
