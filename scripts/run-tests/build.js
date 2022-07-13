const fs = require('fs')
const path = require('path')
const entrypoint = path.resolve(__dirname, 'run.ts')

const distDir = path.resolve(__dirname, '../..', 'dist/scripts')
const distFile = path.resolve(distDir, 'run-tests.js')

require('@vercel/ncc')(entrypoint).then(({ code }) => {
  fs.mkdirSync(distDir, { recursive: true })
  fs.writeFileSync(distFile, code)
})
