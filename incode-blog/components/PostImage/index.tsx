import Image from 'next/image'
import fallbackImage from '~/public/images/post-image-fallback.png'

const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

type PostImageProps = {
  imageSrc: string
  title: string
  width?: number
  height?: number
  layout?: 'fixed' | 'intrinsic' | 'responsive'
  objectFit?: 'cover' | 'contain' | 'none'
}

// https://github.com/vercel/next.js/issues/21079
const PostImage: React.FC<PostImageProps> = ({
  imageSrc,
  title,
  width,
  height,
  layout,
  objectFit,
}: PostImageProps) => {
  if (width && height)
    return (
      <Image
        loader={myLoader}
        src={imageSrc || fallbackImage}
        alt={`featured image for ${title}`}
        height={height}
        width={width}
        layout={layout}
        objectFit={objectFit}
      />
    )
  return (
    <img src={imageSrc || fallbackImage} alt={`featured image for ${title}`} />
  )
}

export default PostImage
