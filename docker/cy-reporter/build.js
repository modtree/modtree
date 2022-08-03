const path = require('path')
const fs = require('fs')
const { fork, spawn } = require('child_process')

// paths
const rootDir = path.resolve(__dirname, '../..')
const tmpDir = path.resolve(__dirname, 'tmp')
const root = (file) => path.resolve(rootDir, file)
const image = 'modtree/cy-reporter'

// files
const f = {
  webpack: root('libs/cy-reporter/webpack.js'),
  buildOutput: root('dist/libs/cy-reporter/server.js'),
  dockerfile: path.resolve(__dirname, 'Dockerfile'),
}

// exit cleanup catch
const cleanup = () => fs.rmdirSync(tmpDir, { recursive: true })
process.on('SIGINT', cleanup)
process.on('exit', cleanup)

// remove old build output
fs.rmSync(f.buildOutput, { force: true })

// create a tmp directory for js build outputs
fs.mkdirSync(tmpDir, { recursive: true })

// build the docker image of the server
function dockerize() {
  const p = spawn(
    'docker',
    ['build', '-t', image, '--file', f.dockerfile, tmpDir],
    { stdio: 'inherit' }
  )
  p.on('close', (code) => {
    console.log('dockerize exited with code', code)
  })
}

// run the webpack build
function build() {
  const p = fork(f.webpack, ['--build'], { stdio: 'inherit' })
  p.on('close', (code) => {
    if (code !== 0) return
    fs.copyFileSync(f.buildOutput, path.resolve(tmpDir, 'server.js'))
    dockerize()
  })
}

build()
