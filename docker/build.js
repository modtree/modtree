require('dotenv/config')
const path = require('path')
const fs = require('fs')
const { fork, spawnSync } = require('child_process')
const { green, yellow } = require('chalk')
const { z } = require('zod')

/**
 * without typescript, this helps to enforce the shape of
 * the config object taken in
 */
const configSchema = z.object({
  tmpDir: z.string(),
  herokuProject: z.string(),
  build: z.object({
    module: z.string(),
    args: z.array(z.string()),
    output: z.string(),
  }),
  dockerfile: z.string(),
})

function build(_config) {
  const parsed = configSchema.safeParse(_config)
  if (!parsed.success) {
    console.error('Config schema:', parsed.error.issues)
    return
  }
  const config = parsed.data
  const image = `registry.heroku.com/${config.herokuProject}/web`

  /**
   * spawnSync but wrapped with default stuff
   *
   * @param {string} cmd
   * @param {string[]} args
   */
  function shell(cmd, args = []) {
    return spawnSync(cmd, args, {
      stdio: 'inherit',
      env: { ...process.env, HEROKU_API_KEY: process.env['HEROKU_API_KEY'] },
    })
  }

  /**
   * send a green message to stdout
   */
  function start(...a) {
    console.log(green('starting:', ...a))
  }

  /**
   * Publish the release on heroku.
   * This requires the image to be already pushed to heroku's container registry.
   */
  function herokuRelease() {
    start('herokuRelease')
    shell('heroku', ['container:release', 'web', '--app', config.herokuProject])
  }

  /**
   * Push the built image to the remote registry
   */
  function pushImage() {
    start('pushImage')
    shell('docker', ['push', image])
  }

  /**
   * Authenticate with docker into heroku's container registry
   */
  function dockerLogin() {
    start('dockerLogin')
    const pass = process.env['HEROKU_API_KEY'] || ''
    shell('docker', ['login', '-u', '_', '-p', pass, 'registry.heroku.com'])
  }

  /**
   * tag the image with the heroku project name
   * before pushing to registry.heroku.com
   */
  function tagImage(imageId) {
    start('tagImage')
    shell('docker', ['tag', imageId, image])
  }

  /**
   * build the docker image of the server
   * returns the id of the build
   */
  function buildImage() {
    const idFile = path.resolve(config.tmpDir, 'id')
    start('buildImage')
    shell('docker', [
      'build',
      '--iidfile',
      idFile,
      '-t',
      image,
      '--file',
      config.dockerfile,
      config.tmpDir,
    ])
    return fs.readFileSync(idFile, { encoding: 'utf8' }).split(':')[1]
  }

  /**
   * Since /dist is docker-ignored, we have to manually copy files
   * out of there into the tmpDir so that this builder script can
   * see it
   */
  function loadDockerContext() {
    start('loadDockerContext')
    fs.copyFileSync(
      config.build.output,
      path.resolve(config.tmpDir, 'container.js')
    )
  }

  /**
   * everything docker-related
   *  - load required executables
   *  - build the image
   *  - tag the image
   *  - login to the remote registry
   *  - push the image
   *  - release
   */
  function dockerize() {
    loadDockerContext()
    tagImage(buildImage())
    // only release on non-arm systems
    if (process.arch.startsWith('arm')) {
      console.log(yellow('Currently on ARM architecture; not releasing.'))
      return
    }
    dockerLogin()
    pushImage()
    herokuRelease()
  }

  /**
   * run the webpack build
   */
  function buildNode() {
    start('buildNode')
    const p = fork(config.build.module, config.build.args, { stdio: 'inherit' })
    p.on('close', (code) => {
      if (code !== 0) throw new Error('build failed')
      dockerize()
    })
  }

  // exit cleanup catch
  const cleanup = () => fs.rmdirSync(config.tmpDir, { recursive: true })
  process.on('SIGINT', cleanup)
  process.on('exit', cleanup)

  // remove old build output
  fs.rmSync(config.build.output, { force: true })

  // create a tmp directory for js build outputs
  fs.mkdirSync(config.tmpDir, { recursive: true })

  // start the build
  buildNode()
}

module.exports = build
