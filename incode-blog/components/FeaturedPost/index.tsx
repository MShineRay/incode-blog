import PostImage from '~/components/PostImage'
import PostAuthor from '~/components/PostAuthor'
import PostDate from '~/components/PostDate'
import PostType from '~/types/post'
import styles from './FeaturedPost.module.scss'

const IMAGE_WIDTH = 330
const IMAGE_HEIGHT = 330
const DEFAULT_TAG = 'Incode News'

type FeaturedPostProps = {
  post: PostType
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({
  post,
}: FeaturedPostProps) => {
  return (
    <div className={styles.featured_post_wrapper}>
      <div className={styles.featured_image_wrapper}>
        <PostImage
          imageSrc={post.feature_image}
          title={post.title}
          height={IMAGE_HEIGHT}
          width={IMAGE_WIDTH}
          objectFit="cover"
          layout="fixed"
        />
      </div>
      <div className={styles.post_card_content}>
        <div className={styles.post_card_header}>
          <h2>{post.title}</h2>
          <PostDate dateString={post.published_at} isShort />
        </div>
        <p className={styles.post_card_excerpt}>
          {post.custom_excerpt || post.excerpt}
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

export default FeaturedPost
