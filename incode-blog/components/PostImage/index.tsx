// import Image from 'next/image'

// const myLoader = ({ src, width, quality }) => {
//   return `${src}?w=${width}&q=${quality || 75}`
// }

type PostImageProps = {
  imageSrc: string
  title: string
}

// https://github.com/vercel/next.js/issues/21079
// const PostImage: React.FC<PostImageProps> = ({ imageSrc, title }: PostImageProps) => (
//   <Image loader={myLoader} src={imageSrc} alt={`featured image for ${title}`} height={200} width={320} />
// )

const PostImage: React.FC<PostImageProps> = ({
  imageSrc,
  title,
}: PostImageProps) => <img src={imageSrc} alt={`featured image for ${title}`} />

export default PostImage
