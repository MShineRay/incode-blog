import Link from 'next/link'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getPosts, getSinglePost } from '~/api/api'
import PostType from '~/types/post'
import Layout from '~/components/Layout/Layout'
import Loader from '~/components/Loader/Loader'
import PostImage from '~/components/PostImage/PostImage'
import PostDate from '~/components/PostDate/PostDate'
import styles from '~/styles/Home.module.scss'

type PostProps = {
  post: PostType
}
const Post: React.FC<PostProps> = ({ post }: PostProps) => {
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
          <Loader />
        ) : (
          <>
            <p className={styles.goback}>
              <Link href="/">
                <a href="/">Go Back</a>
              </Link>
            </p>
            <h1>{post.title}</h1>
            {post.feature_image && (
              <PostImage imageSrc={post.feature_image} title={post.title} />
            )}
            <p>
              By {post.primary_author.name} on{' '}
              <PostDate dateString={post.published_at} />
            </p>
            {post?.tags.map(tag => (
              <span key={tag.id}>{tag.name}</span>
            ))}
            <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
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
