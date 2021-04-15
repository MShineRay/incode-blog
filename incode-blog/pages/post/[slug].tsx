import Link from 'next/link'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { GetStaticPaths } from 'next'
import { getPosts, getSinglePost } from '~/api/api'
import Layout from '~/components/Layout/Layout'
import styles from '~/styles/Home.module.scss'

type Post = {
  title: string
  html: string
  slug: string
  excerpt: string
  og_image: string
  custom_excerpt: string
}

const Post: React.FC<{ post: Post }> = props => {
  const { post } = props
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout
      pageTitle={post.title}
      description={post.custom_excerpt || post.excerpt}
      ogImage={post.og_image}
    >
      <div className={styles.container}>
        {router.isFallback ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <p className={styles.goback}>
              <Link href="/">
                <a href="/">Go Back</a>
              </Link>
            </p>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </>
        )}
      </div>
    </Layout>
  )
}

export default Post

export const getStaticProps = async ({ params }) => {
  const post = await getSinglePost(params.slug)
  return {
    props: { post },
    revalidate: 10000,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = (await getPosts()) || []
  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
