import { useState, useEffect } from 'react'
import facebookIcon from '~/public/images/facebook.svg'
import linkedinIcon from '~/public/images/linkedin.svg'
import twitterIcon from '~/public/images/twitter.svg'
import styles from './Share.module.scss'

type ShareProps = {
  title?: string
  text?: string
  url?: string
}

const Share: React.FC<ShareProps> = ({ title, text, url }: ShareProps) => {
  const [isNativeShare, setNativeShare] = useState(false)
  useEffect(() => {
    if (navigator.canShare) {
      setNativeShare(true)
    }
  }, [])

  const onShare = async () => {
    await navigator.share({
      title: title,
      text: text,
      url: url,
    })
  }
  if (isNativeShare) {
    return (
      <button className={styles.share_button} onClick={onShare}>
        Share
      </button>
    )
  } else {
    return (
      <div>
        <ul className={styles.share_list}>
          <span>Share:</span>
          <li>
            <a
              target="_blank"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              rel="noreferrer"
            >
              <img src={facebookIcon} alt="facebook icon" />
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&amp;title=${title}`}
              rel="noreferrer"
            >
              <img src={linkedinIcon} alt="linkedin icon" />
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href={`https://twitter.com/intent/tweet?url=${url}&amp;text=${title}`}
              rel="noreferrer"
            >
              <img src={twitterIcon} alt="twitter icon" />
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

export default Share
