import Head from 'next/head'

type MetaProps = {
  pageTitle: string
  description?: string
  currentURL?: string
  ogImage?: string
}

const Meta: React.FC<MetaProps> = ({
  pageTitle,
  description = 'Test Description',
  currentURL,
  ogImage,
}: MetaProps) => (
  <Head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
    />
    <meta charSet="utf-8" />
    <title>{pageTitle}</title>
    <link rel="icon" href="/favicon.png" />
    <meta name="description" content={description} />
    <meta property="og:url" content={currentURL} key="ogurl" />
    <meta property="og:image" content={ogImage} key="ogimage" />
    <meta property="og:site_name" content="Incode" key="ogsitename" />
    <meta property="og:title" content={pageTitle} key="ogtitle" />
    <meta property="og:description" content={description} key="ogdesc" />
  </Head>
)

export default Meta
