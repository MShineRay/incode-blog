import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getPosts } from '~/api/api'
import PostType from '~/types/post'
import Layout from '~/components/Layout'
import Container from '~/components/Container'
import PostImage from '~/components/PostImage'
import PostAuthor from '~/components/PostAuthor'
import PostDate from '~/components/PostDate'
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
        <ul>
          {posts.map(post => {
            return (
              <li key={post.slug}>
                <Link
                  href="post/[slug]"
                  as={`/post/${encodeURIComponent(post.slug)}`}
                >
                  <a>
                    {post.feature_image && (
                      <PostImage
                        imageSrc={post.feature_image}
                        title={post.title}
                      />
                    )}
                    <h3>{post?.primary_tag?.name || 'Incode News'}</h3>
                    <h2>{post.title}</h2>
                    <p>{post.custom_excerpt}</p>
                    <div className={styles.post_author_date}>
                      <PostAuthor name={post?.primary_author?.name} showAvatar/>
                      <PostDate dateString={post.published_at} />
                    </div>
                    <hr />
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
