require('dotenv/config')
const path = require('path')
const fs = require('fs')
const { fork, spawnSync } = require('child_process')
const { green } = require('chalk')

// paths
const rootDir = path.resolve(__dirname, '../..')
const tmpDir = path.resolve(__dirname, 'tmp')
const root = (file) => path.resolve(rootDir, file)

// heroku
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

const start = (...a) => console.log(green('starting:', ...a))

/**
 * Publish the release on heroku.
 * This requires the image to be already pushed to heroku's container registry.
 */
function herokuRelease() {
  start('herokuRelease')
  spawnSync('heroku', ['container:release', 'web', '--app', herokuProject], {
    stdio: 'inherit',
    env: { ...process.env, HEROKU_API_KEY: process.env['HEROKU_API_KEY'] },
  })
}

/**
 * Push the built image to the remote registry
 */
function pushImage() {
  start('pushImage')
  spawnSync('docker', ['push', herokuImage], { stdio: 'inherit' })
}

/**
 * Authenticate with docker into heroku's container registry
 */
function dockerLogin() {
  start('dockerLogin')
  const pass = process.env['HEROKU_API_KEY']
  spawnSync('docker', ['login', '-u', '_', '-p', pass, herokuRegistry], {
    stdio: 'inherit',
  })
}

function tagImage() {
  start('tagImage')
  spawnSync('docker', ['tag', `${image}:latest`, herokuImage], {
    stdio: 'inherit',
  })
}

// build the docker image of the server
function buildImage() {
  start('buildImage')
  spawnSync('docker', ['build', '-t', image, '--file', f.dockerfile, tmpDir], {
    stdio: 'inherit',
  })
}

// run the webpack build
function buildNode() {
  start('buildNode')
  const p = fork(f.dev, ['--build'], { stdio: 'inherit' })
  p.on('close', (code) => {
    if (code !== 0) throw new Error('build failed')
    fs.copyFileSync(f.buildOutput, path.resolve(tmpDir, 'server.js'))
    buildImage()
    tagImage()
    dockerLogin()
    pushImage()
    if (!process.arch.startsWith('arm')) {
      // only release on non-arm systems
      herokuRelease()
    } else {
      console.log(yellow('Currently on ARM architecture; not releasing.'))
    }
  })
}

// exit cleanup catch
const cleanup = () => fs.rmdirSync(tmpDir, { recursive: true })
process.on('SIGINT', cleanup)
process.on('exit', cleanup)

// remove old build output
fs.rmSync(f.buildOutput, { force: true })

// create a tmp directory for js build outputs
fs.mkdirSync(tmpDir, { recursive: true })

// start the build
buildNode()
