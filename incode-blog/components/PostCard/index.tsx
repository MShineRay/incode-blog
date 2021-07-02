import cx from 'classnames'
import { excerpt } from '~/utils/helpers'
import PostImage from '~/components/PostImage'
import PostDate from '~/components/PostDate'
import ReadingTime from '~/components/ReadingTime'
import PostType from '~/types/post'
import styles from './PostCard.module.scss'

type PostCardProps = {
  post: PostType
  isFeatured?: boolean
}

const IMAGE_WIDTH = 290
const IMAGE_HEIGHT = 212
const DEFAULT_TAG = 'Incode News'

const PostCard: React.FC<PostCardProps> = ({
  post,
  isFeatured,
}: PostCardProps) => {
  return (
    <div
      className={cx(styles.post_card_wrapper, {
        [styles.post_card_featured]: isFeatured,
      })}
    >
      <PostImage
        imageSrc={post.feature_image}
        title={post.title}
        height={IMAGE_HEIGHT}
        width={IMAGE_WIDTH}
        objectFit="cover"
        layout="responsive"
      />
      <div className={styles.post_card_content}>
        <p className={styles.category}>
          {post?.primary_tag?.name || DEFAULT_TAG}
        </p>
        <div className={styles.post_card_header}>
          <h3>{post.title}</h3>
        </div>
        <p className={styles.post_card_excerpt}>
          {excerpt(post.custom_excerpt || post.excerpt)}
        </p>
        <div className={styles.post_card_footer}>
          <PostDate dateString={post.published_at} />
          <span className={styles.dot_separator}>&#183;</span>
          <ReadingTime readingTime={post.reading_time} />
        </div>
      </div>
    </div>
  )
}

export default PostCard
