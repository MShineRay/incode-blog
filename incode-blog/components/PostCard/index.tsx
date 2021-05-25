import cx from 'classnames'
import { excerpt } from '~/utils/helpers'
import PostImage from '~/components/PostImage'
import PostAuthor from '~/components/PostAuthor'
import PostDate from '~/components/PostDate'
import PostType from '~/types/post'
import styles from './PostCard.module.scss'

type PostCardProps = {
  post: PostType
  isFeatured?: boolean
}

const IMAGE_WIDTH = 345
const IMAGE_HEIGHT = 245
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
        <div className={styles.post_card_header}>
          <h3>{post.title}</h3>
          <PostDate dateString={post.published_at} isShort />
        </div>
        <p className={styles.post_card_excerpt}>
          {excerpt(post.custom_excerpt || post.excerpt)}
        </p>
        <div className={styles.separator} />
        <div className={styles.post_card_footer}>
          <PostAuthor name={post.primary_author.name} />
          <p>{post?.primary_tag?.name || DEFAULT_TAG}</p>
        </div>
      </div>
    </div>
  )
}

export default PostCard
