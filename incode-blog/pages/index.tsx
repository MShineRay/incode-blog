import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getPosts } from '~/api/api'
import PostType from '~/types/post'
import Layout from '~/components/Layout/Layout'
import styles from '~/styles/Home.module.scss'

type HomeProps = {
  posts: PostType[]
}

const Home: React.FC<HomeProps> = ({ posts }: HomeProps) => {
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
                <Link href="post/[slug]" as={`/post/${post.slug}`}>
                  <a>
                    <h3>{post.title}</h3>
                    <p>{post.custom_excerpt}</p>
                  </a>
                </Link>
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
