/**
 * web root config
 */
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'modtree',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 0,
    'react/react-in-jsx-scope': 0,
  },
}
