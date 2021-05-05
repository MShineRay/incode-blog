import PostImage from '~/components/PostImage'
import PostAuthor from '~/components/PostAuthor'
import PostDate from '~/components/PostDate'
import PostType from '~/types/post'
import styles from './PostCard.module.scss'

type PostCardProps = {
  post: PostType
  isFeatured?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ post }: PostCardProps) => {
  return (
    <div className={styles.post_card_wrapper}>
      {post.feature_image && (
        <PostImage imageSrc={post.feature_image} title={post.title} />
      )}
      <div className={styles.post_card_content}>
        <div className={styles.post_card_header}>
          <h3>{post.title}</h3>
          <PostDate dateString={post.published_at} isShort />
        </div>
        <p className={styles.post_card_excerpt}>
          {post.custom_excerpt || post.excerpt}
        </p>
        <div className={styles.post_card_footer}>
          <PostAuthor name={post.primary_author.name} />
          <p>{post?.primary_tag?.name || 'Incode News'}</p>
        </div>
      </div>
    </div>
  )
}

export default PostCard
