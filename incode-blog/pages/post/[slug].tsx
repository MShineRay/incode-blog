import Link from 'next/link'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getPosts, getSinglePost } from '~/api/api'
import Layout from '~/components/Layout/Layout'
import PostDate from '~/components/PostDate/PostDate'
import styles from '~/styles/Home.module.scss'

type Post = {
  title: string
  meta_title: string
  meta_description: string
  published_at: string
  html: string
  slug: string
  excerpt: string
  og_image: string
  tags: any
}

const Post: React.FC<{ post: Post }> = props => {
  const { post } = props
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout
      pageTitle={post.meta_title || post.title}
      description={post.meta_description || post.excerpt}
      ogImage={post.og_image}
      currentURL={`/post/${encodeURIComponent(post.slug)}`}
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
            <PostDate dateString={post.published_at}/>
            {post?.tags.map(tag => (
              <span key={tag.id}>{tag.name}</span>
            ))}
            <div dangerouslySetInnerHTML={{ __html: post.html }} ></div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Post

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getSinglePost(params.slug as string)
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
