import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getPosts } from '~/pages/api/cms'
import PostType from '~/types/post'
import Layout from '~/components/Layout'
import Container from '~/components/Container'
import PostCard from '~/components/PostCard'
import Subscribe from '~/components/Subscribe'
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
      <Container>
        <h1>Blog</h1>
        <p className={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <ul className={styles.posts_container}>
          {posts.map(post => {
            return (
              <li key={post.slug}>
                <Link
                  href="post/[slug]"
                  as={`/post/${encodeURIComponent(post.slug)}`}
                >
                  <a>
                    <PostCard post={post} isFeatured={post.featured} />
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
        <Subscribe/>
      </Container>
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
