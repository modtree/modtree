import { useRouter } from 'next/router'
import { Footer } from './components/Footer'

const theme = {
  github: 'https://github.com/modtree/modtree',
  projectLink: 'https://github.com/modtree/modtree',
  titleSuffix: ' | modtree',
  search: false,
  unstable_flexsearch: false,
  unstable_staticImage: false,
  floatTOC: true,
  darkMode: true,
  font: false,
  banner: null,
  logo: <div className="logo" />,
  head: function Head({ title, meta }) {
    const router = useRouter()
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/images/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000" />
        <meta property="og:type" content="website" />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={meta.description} />
        <meta
          property="og:url"
          content={`https://modtree-docs.vercel.app${router.asPath}`}
        />
        <meta
          property="og:image"
          content={`https://modtree-docs.vercel.app${
            meta.ogImage ?? '/og-image.png'
          }`}
        />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="Modtree" />
      </>
    )
  },
  footerEditLink: () => {
    return 'Edit this page on GitHub'
  },
  footerText: () => {
    return <Footer />
  },
  nextThemes: {
    defaultTheme: 'system',
  },
}
export default theme
