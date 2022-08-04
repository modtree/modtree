require('dotenv/config')
const path = require('path')
const fs = require('fs')
const { fork, spawn } = require('child_process')

// paths
const rootDir = path.resolve(__dirname, '../..')
const tmpDir = path.resolve(__dirname, 'tmp')
const root = (file) => path.resolve(rootDir, file)
const image = 'modtree/cy-reporter'
const herokuProject = 'modtree-cy-reporter'
const herokuRegistry = 'registry.heroku.com'
const herokuImage = `${herokuRegistry}/${herokuProject}/web`

// files
const f = {
  dev: root('libs/cy-reporter/dev.js'),
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

function herokuRelease() {
  const p = spawn(
    'heroku',
    ['container:release', 'web', '--app', herokuProject],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        HEROKU_API_KEY: process.env['HEROKU_API_KEY'],
      },
    }
  )
  p.on('close', (code) => {
    if (code !== 0) throw new Error('heroku release failed')
  })
}

function dockerLoginStdIn() {
  const p = spawn(
    'sh',
    [
      '-c',
      `echo ${process.env['HEROKU_API_KEY']} | docker login ${herokuRegistry} -u _ --password-stdin`,
    ],
    { stdio: 'inherit' }
  )
  p.on('close', (code) => {
    if (code !== 0) throw new Error('docker login failed')
    pushImage()
  })
}

function dockerLogin() {
  const p = spawn(
    'docker',
    [
      'login',
      '--username=_',
      `--password=${process.env['HEROKU_API_KEY']}`,
      herokuRegistry,
    ],
    { stdio: 'inherit' }
  )
  p.on('close', (code) => {
    if (code !== 0) throw new Error('docker login failed')
    pushImage()
  })
}

function pushImage() {
  const p = spawn('docker', ['push', herokuImage], { stdio: 'inherit' })
  p.on('close', (code) => {
    if (code !== 0) throw new Error('push image failed')
    herokuRelease()
  })
}

function tagImage() {
  const p = spawn('docker', ['tag', `${image}:latest`, herokuImage], {
    stdio: 'inherit',
  })
  p.on('close', (code) => {
    if (code !== 0) throw new Error('tag image failed')
    dockerLogin()
  })
}

// build the docker image of the server
function dockerize() {
  const p = spawn(
    'docker',
    ['build', '-t', image, '--file', f.dockerfile, tmpDir],
    { stdio: 'inherit' }
  )
  p.on('close', (code) => {
    if (code !== 0) throw new Error('dockerize failed')
    tagImage()
  })
}

// run the webpack build
function build() {
  const p = fork(f.dev, ['--build'], { stdio: 'inherit' })
  p.on('close', (code) => {
    if (code !== 0) throw new Error('build failed')
    fs.copyFileSync(f.buildOutput, path.resolve(tmpDir, 'server.js'))
    // herokuPush()
    dockerize()
  })
}

build()
