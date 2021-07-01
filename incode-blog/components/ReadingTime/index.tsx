const minuteStr = '1 minute read'
const minutesStr = '% minutes read'

type ReadingTimeProps = {
  readingTime?: number
}

const ReadingTime: React.FC<ReadingTimeProps> = ({
  readingTime,
}: ReadingTimeProps) => {

  if (!readingTime) return ''
  return readingTime <= 1
    ? minuteStr
    : minutesStr.replace('%', `${readingTime}`)
}

export default ReadingTime
