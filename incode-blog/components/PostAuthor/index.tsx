import PostDate from '~/components/PostDate'
import ReadingTime from '~/components/ReadingTime'
import avatarFallback from '~/public/images/avatar.svg'
import styles from './PostAuthor.module.scss'

type PostAuthorProps = {
  showAvatar?: boolean
  avatar?: string
  name: string
  date?: string
  time?: number
}

const PostAuthor: React.FC<PostAuthorProps> = ({
  name,
  avatar = avatarFallback,
  showAvatar = false,
  date,
  time,
}: PostAuthorProps) => {
  return (
    <span className={styles.post_author_container}>
      {showAvatar && (
        <img src={avatar} className={styles.avatar} alt="author avatar" />
      )}
      <span>
        {name}
        <br />
        <span className={styles.date_time}>
          {date && <PostDate dateString={date} />}
          {time && (
            <>
              <span className={styles.dot_separator}>&#183;</span>
              <ReadingTime readingTime={time} />
            </>
          )}
        </span>
      </span>
    </span>
  )
}

export default PostAuthor
