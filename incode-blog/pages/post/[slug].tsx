import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getPosts, getSinglePost, getPostsByTag } from '~/api/api'
import PostType from '~/types/post'
import Custom404 from '~/pages/404'
import Slider from '~/components/Slider'
import Layout from '~/components/Layout'
import Container from '~/components/Container'
import Loader from '~/components/Loader'
import PostImage from '~/components/PostImage'
import PostDate from '~/components/PostDate'
import PostAuthor from '~/components/PostAuthor'
import PostCard from '~/components/PostCard'
import GoHome from '~/components/GoHome'
import Share from '~/components/Share'
import styles from '~/styles/Post.module.scss'

const url = process.env['BLOG_URL']

type PostProps = {
  post: PostType
  relatedPosts: PostType[]
}

const IMAGE_WIDTH = 1100
const IMAGE_HEIGHT = 512
const SLIDES_NUMBER = 3
const SLIDES_SPACING = 10

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
            <GoHome />
            <article className={styles.article}>
              <figure>
                <div className={styles.overlay}>
                  <PostImage
                    imageSrc={post.feature_image}
                    title={post.title}
                    height={IMAGE_HEIGHT}
                    width={IMAGE_WIDTH}
                    objectFit="cover"
                    layout="responsive"
                  />
                </div>
                <figcaption>{post.title}</figcaption>
              </figure>
              <div className={styles.post_header}>
                <p>
                  By <PostAuthor name={post.primary_author.name} /> on{' '}
                  <PostDate dateString={post.published_at} />
                </p>
                <Share
                  title={post.meta_title || post.title}
                  url={`${url}/post/${encodeURIComponent(post.slug)}`}
                  text={post.meta_description || post.excerpt}
                />
              </div>
              <hr className={styles.separator} />
              <div className={styles.post_body}>
                <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
                <Share
                  title={post.meta_title || post.title}
                  url={`${url}/post/${encodeURIComponent(post.slug)}`}
                  text={post.meta_description || post.excerpt}
                />
              </div>
            </article>
          </>
        )}
        {relatedPosts.length !== 0 && (
          <>
            <h3>Related Posts</h3>
            <Slider
              numberOfSlides={SLIDES_NUMBER}
              slidesSpacing={SLIDES_SPACING}
              isCentered
              isLooped
              slidesMode="free-snap"
            >
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.slug}>
                  <Link
                    href="../post/[slug]"
                    as={`../post/${encodeURIComponent(relatedPost.slug)}`}
                  >
                    <a>
                      <div className={styles.slide_wrapper}>
                        <PostCard post={relatedPost} isFeatured={false} />
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </Slider>
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
