import { parseISO, format } from 'date-fns'

type PostDateProps = {
  dateString: string
}

const PostDate: React.FC<PostDateProps> = ({ dateString }: PostDateProps) => {
  const date = parseISO(dateString)
  return (
      <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
  )
}

export default PostDate
