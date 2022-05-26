import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { Footer } from "./components/Footer";

function getMode(classList) {
  if (classList.contains('dark')) {
    return 'dark'
  }
  return 'light'
}

const theme = {
  github: "https://github.com/modtree/modtree",
  projectLink: "https://github.com/modtree/modtree",
  titleSuffix: " | modtree",
  search: false,
  unstable_flexsearch: false,
  unstable_staticImage: false,
  floatTOC: true,
  darkMode: true,
  font: false,
  banner: null,
  logo: () => {
    const [mode, setMode] = useState('light')
    useEffect(() => {
      const node = document.getElementsByTagName('html')[0]
      const observer = new MutationObserver(() =>
        setMode(getMode(document.documentElement.classList))
      )
      observer.observe(node, {
        attributes: true,
      })
    }, [])
    return mode === 'light' ? (
      <img src="/logo.svg" width={160} />
    ) : (
      <img src="/logo-dark.svg" width={160} />
    )
  },
  head: function Head({ title, meta }) {
    const router = useRouter();
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@turborepo" />
        <meta name="twitter:creator" content="@turborepo" />
        <meta property="og:type" content="website" />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={meta.description} />
        <meta
          property="og:url"
          content={`https://turborepo.org${router.asPath}`}
        />
        <meta
          property="og:image"
          content={`https://turborepo.org${meta.ogImage ?? "/og-image.png"}`}
        />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="Turborepo" />
      </>
    );
  },
  footerEditLink: () => {
    return "Edit this page on GitHub";
  },
  footerText: () => {
    return <Footer />;
  },
  nextThemes: {
    defaultTheme: "system",
  },
};
export default theme;
