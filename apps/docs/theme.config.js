import { useEffect, useState } from 'react'

function getMode(classList) {
  if (classList.contains('dark')) {
    return 'dark'
  }
  return 'light'
}

// theme.config.js
export default {
  projectLink: 'https://github.com/modtree/modtree', // GitHub link in the navbar
  titleSuffix: ' – modtree',
  nextLinks: true,
  prevLinks: true,
  search: false,
  customSearch: null, // customizable, you can use algolia for example
  darkMode: true,
  footer: true,
  footerText: `MIT ${new Date().getFullYear()} © modtree.`,
  footerEditLink: '',
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
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="modtree: the graphic degree planner" />
      <meta name="og:title" content="modtree: the graphic degree planner" />
    </>
  ),
}
