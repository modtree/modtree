// theme.config.js
export default {
  projectLink: "https://github.com/modtree/modtree", // GitHub link in the navbar
  titleSuffix: " – modtree",
  nextLinks: true,
  prevLinks: true,
  search: false,
  customSearch: null, // customizable, you can use algolia for example
  darkMode: true,
  footer: true,
  footerText: `MIT ${new Date().getFullYear()} © modtree.`,
  footerEditLink: 'Edit this page on GitHub',
  logo: (
    <>
      <img src="/logo.png" width={160} />
    </>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="og:title" content="Nextra: the next docs builder" />
    </>
  ),
};
