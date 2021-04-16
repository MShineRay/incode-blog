import GhostContentAPI from '@tryghost/content-api'
import PostType from '~/types/post'

const url = process.env['BLOG_URL'] || ''
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
