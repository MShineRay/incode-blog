const maxLength = 120
export const excerpt = (str: string) =>
  str.length > maxLength ? str.substr(0, maxLength) + '...' : str

export const calculateReadingTime = (html?: string): number => {
  if (!html) {
    return 0
  }
  const text = html.replace(/<(.|\n)*?>/g, ' ')
  const wordCount = text.split(' ').length
  const wordsPerMinute = 275
  const wordsPerSecond = wordsPerMinute / 60
  const readingTimeSeconds = wordCount / wordsPerSecond
  const readingTimeMinutes = Math.floor(readingTimeSeconds / 60)
  return readingTimeMinutes
}
