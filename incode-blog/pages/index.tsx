import {GetStaticProps} from 'next'
import Layout from '~/components/Layout/Layout'
import styles from '~/styles/Home.module.scss'

const { BLOG_URL, CONTENT_API_KEY } = process.env

type Post = {
  title: string
  slug: string
  custom_excerpt: string
}

async function getPosts() {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt`,
  ).then(res => res.json())
  return res.posts
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = (await getPosts()) || []
  return {
    props: { posts },
    revalidate: 10000,
  }
}

const Home: React.FC<{ posts: Post[] }> = props => {
  const { posts } = props
  return (
    <Layout pageTitle="Incode Blog" description="this is an Incode blog landing page">
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
