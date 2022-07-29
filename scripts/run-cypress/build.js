const fs = require('fs')
const path = require('path')

const buildList = [
  {
    entry: 'reporter.ts',
    dist: 'apps/web-e2e/reporters/json.js',
    minify: true,
  },
  {
    entry: 'sender.ts',
    dist: 'apps/web-e2e/reporters/sender.js',
    minify: false,
  },
  // {
  //   entry: 'list.ts',
  //   dist: 'dist/scripts/run-cypress/list.js',
  // },
  {
    entry: 'db.ts',
    dist: 'dist/scripts/run-cypress/db.js',
    minify: false,
  },
]

const ncc = require('@vercel/ncc')

/**
 * build packages one by one to prevent bugs
 */
let queue
buildList.forEach(({ entry, dist, minify }) => {
  const entrypoint = path.resolve(__dirname, entry)
  if (!queue) {
    queue = ncc(entrypoint, { minify })
  } else {
    queue = queue.then(() => ncc(entrypoint, { minify }))
  }
  queue = queue.then(({ code }) => {
    fs.mkdirSync(path.dirname(dist), { recursive: true })
    fs.rmSync(dist, { force: true })
    fs.writeFileSync(dist, code)
  })
})
