import { useEffect } from 'react'

function getMode(className) {
  if (className.includes(' ')) {
    const split = className.split(' ')
    if (split.includes('light')) {
      return 'light'
    } else if (split.includes('dark')) {
      return 'dark'
    }
  } else if (className === 'light') {
    return 'light'
  } else if (className === 'dark') {
    return dark
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
    useEffect(() => {
      if (document) {
        console.log(getMode(document.documentElement.className))
      }
    }, [])
    return (
      <div className="bg-blue-200">
        <img src="/logo.png" width={160} />
      </div>
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
