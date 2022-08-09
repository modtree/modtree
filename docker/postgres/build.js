const { spawn } = require('child_process')
const { resolve } = require('path')
const dockerfile = resolve(__dirname, 'Dockerfile')
const image = 'modtree/postgres'
const args = process.argv.slice(2)
const tag = args[0] ? ':' + args[0] : ''

spawn('docker', ['build', '-f', dockerfile, '-t', image + tag, '../..'], {
  cwd: __dirname,
  stdio: 'inherit',
})
