import TagType from './tag'
import AuthorType from './author'

interface PostType {
  title: string
  meta_title: string
  meta_description: string
  published_at: string
  featured: boolean
  feature_image: string
  primary_tag: TagType
  primary_author: AuthorType
  html: string
  slug: string
  excerpt: string
  custom_excerpt: string
  og_image: string
  tags: TagType[]
  authors: AuthorType[]
}

export default PostType
