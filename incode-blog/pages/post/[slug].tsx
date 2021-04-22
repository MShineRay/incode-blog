import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getPosts, getSinglePost, getPostsByTag } from '~/api/api'
import PostType from '~/types/post'
import Custom404 from '~/pages/404'
import Layout from '~/components/Layout/Layout'
import Container from '~/components/Container/Container'
import Loader from '~/components/Loader/Loader'
import PostImage from '~/components/PostImage/PostImage'
import PostDate from '~/components/PostDate/PostDate'
import styles from '~/styles/Home.module.scss'

type PostProps = {
  post: PostType
  relatedPosts: PostType[]
}
const Post: React.FC<PostProps> = ({ post, relatedPosts }: PostProps) => {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <Custom404 />
  }
  return (
    <Layout
      pageTitle={post.meta_title || post.title}
      description={post.meta_description || post.excerpt}
      ogImage={post.og_image}
      currentURL={`/post/${encodeURIComponent(post.slug)}`}
    >
      <Container>
        {router.isFallback ? (
          <Loader />
        ) : (
          <>
            <p className={styles.goback}>
              <Link href="/">
                <a href="/">Go Back</a>
              </Link>
            </p>
            <article>
              <h1>{post.title}</h1>
              {post.feature_image && (
                <PostImage imageSrc={post.feature_image} title={post.title} />
              )}
              <p>
                By {post.primary_author.name} on{' '}
                <PostDate dateString={post.published_at} />
              </p>
              {post?.tags.map(tag => (
                <Link
                  key={tag.id}
                  href="../tag/[slug]"
                  as={`../tag/${encodeURIComponent(tag.slug)}`}
                  passHref
                >
                  <a>
                    <span>{tag.name} </span>
                  </a>
                </Link>
              ))}
              <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
            </article>
          </>
        )}
        {relatedPosts.length !== 0 && (
          <>
            <h2>Related posts</h2>
            <div className={styles.related_posts_container}>
              <div className={styles.post_row}>
                {relatedPosts.map(relatedPost => (
                  <div key={relatedPost.slug} className={styles.post_item}>
                    <Link
                      href="../post/[slug]"
                      as={`../post/${encodeURIComponent(relatedPost.slug)}`}
                    >
                      <a>
                        <PostImage
                          imageSrc={relatedPost.feature_image}
                          title={relatedPost.title}
                        />
                        <p>{relatedPost.title}</p>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Container>
    </Layout>
  )
}

export default Post

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getSinglePost(params.slug as string)
  const tagSlug = post?.primary_tag?.slug
  const allRelatedPosts = (tagSlug && (await getPostsByTag(tagSlug))) || []
  const relatedPosts = allRelatedPosts.filter(item => item.slug !== post.slug)
  return {
    props: { post, relatedPosts },
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
