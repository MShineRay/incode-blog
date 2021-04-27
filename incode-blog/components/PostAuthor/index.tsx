import avatarFallback from '~/public/images/avatar.svg'
import styles from './PostAuthor.module.scss'

type PostAuthorProps = {
  showAvatar?: boolean
  avatar?: string
  name: string
}

const PostAuthor: React.FC<PostAuthorProps> = ({
  name,
  avatar = avatarFallback,
  showAvatar = false,
}: PostAuthorProps) => {
  return (
    <span className={styles.post_author_container}>
      {showAvatar && <img src={avatar} alt="author avatar" />}
      {name}
    </span>
  )
}

export default PostAuthor
