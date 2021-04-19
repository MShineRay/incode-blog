import { DiscussionEmbed } from 'disqus-react'

type PostCommentsProps = {
  postSlug: string
  postTitle: string
  postUrl: string
}
const disqusShortname = process.env.DISCUS_SHORTNAME

const PostComments: React.FC<PostCommentsProps> = ({
  postSlug,
  postTitle,
  postUrl,
}: PostCommentsProps) => {
  const disqusConfig = {
    url: postUrl,
    identifier: postSlug,
    title: postTitle,
  }
  return (
    <div>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  )
}

export default PostComments
