import { GetStaticProps } from 'next'
import { getPosts } from '~/api/api'
import Layout from '~/components/Layout/Layout'
import styles from '~/styles/Home.module.scss'

type Post = {
  title: string
  slug: string
  custom_excerpt: string
}

const Home: React.FC<{ posts: Post[] }> = props => {
  const { posts } = props
  return (
    <Layout
      pageTitle="Incode Blog"
      description="this is an Incode blog landing page"
    >
      <div className={styles.container}>
        <h1>Blog</h1>
        <ul>
          {posts.map(post => {
            return (
              <li key={post.slug}>
                <h3>{post.title}</h3>
                <p>{post.custom_excerpt}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </Layout>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const posts = (await getPosts()) || []
  return {
    props: { posts },
    revalidate: 10000,
  }
}
