const fs = require('fs')
const path = require('path')

const buildList = [
  {
    entry: 'reporter.ts',
    dist: 'apps/web-e2e/reporters/json.js',
  },
  {
    entry: 'list.ts',
    dist: 'dist/scripts/run-cypress/list.js',
  },
]

buildList.forEach(({ entry, dist }) => {
  require('@vercel/ncc')(path.resolve(__dirname, entry), {
    minify: true,
  }).then(({ code }) => {
    fs.mkdirSync(path.dirname(dist), { recursive: true })
    fs.writeFileSync(dist, code)
  })
})
