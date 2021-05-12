import GhostContentAPI from '@tryghost/content-api'
import PostType from '~/types/post'
import TagType from '~/types/tag'

const url = process.env['CMS_URL'] || ''
const key = process.env['CONTENT_API_KEY'] || ''

const api = new GhostContentAPI({
  url,
  key,
  version: 'v3',
})

export async function getPosts(): Promise<PostType[]> {
  const posts = await api.posts.browse({
    include: ['tags', 'authors'],
    limit: 'all',
  })
  return posts
}

export async function getSinglePost(postSlug: string): Promise<PostType> {
  const post = await api.posts.read(
    { slug: postSlug },
    { include: ['tags', 'authors'] },
  )
  return post
}

export async function getPostsByTag(tagSlug: string): Promise<PostType[]> {
  const posts = await api.posts.browse({
    include: ['tags', 'authors'],
    limit: 'all',
    filter: `tags.slug:${tagSlug}`,
  })
  return posts
}

export async function getTags(): Promise<TagType[]> {
  const tags = await api.tags.browse({
    limit: 'all',
  })
  return tags
}

export async function getSingleTag(tagSlug: string): Promise<TagType> {
  const tag = await api.tags.read(
    { slug: tagSlug },
    { include: 'count.posts' },
  )
  return tag
}
