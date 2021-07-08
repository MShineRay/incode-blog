import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getPosts } from '~/pages/api/cms'
import PostType from '~/types/post'
import Layout from '~/components/Layout'
import Container from '~/components/Container'
import FeaturedPost from '~/components/FeaturedPost'
import PostCard from '~/components/PostCard'
import styles from '~/styles/Home.module.scss'

type HomeProps = {
  posts: PostType[]
}

const Home: React.FC<HomeProps> = ({ posts }: HomeProps) => {
  const featuredPost = posts.find(({ featured }) => featured)
  return (
    <Layout
      pageTitle="Incode Blog"
      description="this is an Incode blog landing page"
    >
      <Container>
        <div className={styles.featured_post_container}>
          <FeaturedPost post={featuredPost} />
        </div>
        <ul className={styles.posts_container}>
          {posts.map(post => {
            return (
              <li key={post.slug}>
                <Link
                  href="post/[slug]"
                  as={`/post/${encodeURIComponent(post.slug)}`}
                >
                  <a>
                    <PostCard post={post} />
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
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
