import GhostContentAPI from '@tryghost/content-api'

const url = process.env['BLOG_URL'] || ''
const key = process.env['CONTENT_API_KEY'] || ''

const api = new GhostContentAPI({
  url,
  key,
  version: 'v3',
})

export async function getPosts() {
  return await api.posts
    .browse({
      include: ['title', 'slug', 'custom_excerpt'],
      limit: 'all',
    })
    .catch(err => {
      console.error(err)
    })
}
