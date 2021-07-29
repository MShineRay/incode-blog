import { useState } from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getPosts, getTags } from '~/pages/api/cms'
import PostType from '~/types/post'
import TagType from '~/types/tag'
import Layout from '~/components/Layout'
import Container from '~/components/Container'
import FeaturedPost from '~/components/FeaturedPost'
import Dropdown from '~/components/Dropdown'
import CategorySelect from '~/components/CategorySelect'
import PostCard from '~/components/PostCard'
import useMobileDetect from '~/utils/useMobileDetect'
import styles from '~/styles/Home.module.scss'

type HomeProps = {
  posts: PostType[]
  tags: TagType[]
}

const Home: React.FC<HomeProps> = ({ posts, tags }: HomeProps) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const featuredPost = posts.find(({ featured }) => featured)
  const categories = tags.map(({ name }) => name)
  categories.push('All')
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.primary_tag?.name == selectedCategory)
    : posts
  const handleCategorySelect = (selected: string) =>
    selected.includes('All')
      ? setSelectedCategory('')
      : setSelectedCategory(selected)
  const { isMobile } = useMobileDetect()
  return (
    <Layout
      pageTitle="Incode Blog"
      description="this is an Incode blog landing page"
    >
      <Container>
        {isMobile ? (
          <Dropdown
            dropdownPlaceholder="Category"
            dropdownArray={categories}
            handleDropdownSelect={handleCategorySelect}
          />
        ) : (
          <CategorySelect
            categoryPlaceholder="Category"
            categoryArray={categories}
            handleCategorySelect={handleCategorySelect}
          />
        )}
        {!selectedCategory && (
          <div className={styles.featured_post_container}>
            <FeaturedPost post={featuredPost} />
          </div>
        )}
        <ul className={styles.posts_container}>
          {filteredPosts.map(post => {
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
  const tags = (await getTags()) || []
  return {
    props: { posts, tags },
    revalidate: 10000,
  }
}
