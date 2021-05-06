import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getTags, getSingleTag, getPostsByTag } from '~/api/api'
import TagType from '~/types/tag'
import PostType from '~/types/post'
import Custom404 from '~/pages/404'
import Layout from '~/components/Layout'
import Container from '~/components/Container'
import Loader from '~/components/Loader'
import GoHome from '~/components/GoHome'
import PostCard from '~/components/PostCard'
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
            <GoHome />
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
                        <PostCard post={relatedPost} isFeatured={false} />
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
