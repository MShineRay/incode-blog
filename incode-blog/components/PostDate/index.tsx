import { parseISO, format } from 'date-fns'

type PostDateProps = {
  dateString: string
  isShort?: boolean
}

const PostDate: React.FC<PostDateProps> = ({
  dateString,
  isShort,
}: PostDateProps) => {
  const date = parseISO(dateString)
  const dateFormat = isShort ? 'LLL d' : 'LLL d, yyyy'
  return <time dateTime={dateString}>{format(date, dateFormat)}</time>
}

export default PostDate
