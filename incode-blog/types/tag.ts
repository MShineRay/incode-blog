interface TagType {
  id: string
  name: string
  slug: string
  description: string
  feature_image: string
  meta_title: string
  meta_description: string
  count: {
    posts: number
  }
}

export default TagType
