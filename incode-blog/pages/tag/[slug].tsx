import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getTags, getSingleTag, getPostsByTag } from '~/api/api'
import TagType from '~/types/tag'
import PostType from '~/types/post'
import Custom404 from '~/pages/404'
import Layout from '~/components/Layout/Layout'
import Container from '~/components/Container/Container'
import Loader from '~/components/Loader/Loader'
import PostImage from '~/components/PostImage/PostImage'
import styles from '~/styles/Home.module.scss'

type TagProps = {
  tag: TagType
  relatedPosts: PostType[]
}
const Tag: React.FC<TagProps> = ({ tag, relatedPosts }: TagProps) => {
  const router = useRouter()
  if (!router.isFallback && !tag?.slug) {
    return <Custom404 />
  }
  return (
    <Layout
      pageTitle={tag.meta_title || tag.name}
      description={tag.meta_description || tag.description}
      currentURL={`/tag/${encodeURIComponent(tag.slug)}`}
    >
      <Container>
        {router.isFallback ? (
          <Loader />
        ) : (
          <>
            <p className={styles.goback}>
              <Link href="/" passHref>
                <a>Go Back</a>
              </Link>
            </p>
            <h1>Category: {tag.name}</h1>
            <p>Posts under this category: {tag.count.posts}</p>
          </>
        )}
        {relatedPosts.length !== 0 && (
          <>
            <h2>Posts under {tag.name.toLowerCase()} category</h2>
            <div className={styles.related_posts_container}>
              <div className={styles.post_row}>
                {relatedPosts.map(relatedPost => (
                  <div key={relatedPost.slug} className={styles.post_item}>
                    <Link
                      href="../post/[slug]"
                      as={`../post/${encodeURIComponent(relatedPost.slug)}`}
                    >
                      <a>
                        {relatedPost.feature_image && (
                          <PostImage
                            imageSrc={relatedPost.feature_image}
                            title={relatedPost.title}
                          />
                        )}
                        <h3>{relatedPost.title}</h3>
                        <p>{relatedPost.excerpt}</p>
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

export default Tag

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tag = await getSingleTag(params.slug as string)
  const tagSlug = tag.slug
  const relatedPosts = (tagSlug && (await getPostsByTag(tagSlug))) || []
  return {
    props: { tag, relatedPosts },
    revalidate: 10000,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = (await getTags()) || []
  return {
    paths: tags.map(tag => {
      return {
        params: {
          slug: tag.slug,
        },
      }
    }),
    fallback: false,
  }
}
