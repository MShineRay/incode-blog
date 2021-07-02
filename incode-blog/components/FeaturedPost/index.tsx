import PostImage from '~/components/PostImage'
import PostAuthor from '~/components/PostAuthor'
import PostType from '~/types/post'
import styles from './FeaturedPost.module.scss'

const IMAGE_WIDTH = 600
const IMAGE_HEIGHT = 500
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
          <p>{post?.primary_tag?.name || DEFAULT_TAG}</p>
          <p className={styles.featured}>Featured</p>
        </div>
        <h1>{post.title}</h1>
        <p className={styles.post_card_excerpt}>
          {post.custom_excerpt || post.excerpt}
        </p>
        <div className={styles.post_card_footer}>
          <PostAuthor
            name={post.primary_author.name}
            avatar={post.primary_author.profile_image}
            date={post.published_at}
            time={post.reading_time}
            showAvatar
          />
        </div>
      </div>
    </div>
  )
}

export default FeaturedPost
