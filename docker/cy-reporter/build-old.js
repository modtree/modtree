require('dotenv/config')
const path = require('path')
const fs = require('fs')
const { fork, spawnSync } = require('child_process')
const { green, yellow } = require('chalk')

function build(config) {
  const imageName = `registry.heroku.com/${config.herokuProject}/web`
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
    shell('docker', ['push', imageName])
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
    shell('docker', ['tag', imageId, imageName])
  }

  /**
   * build the docker image of the server
   * returns the id of the build
   */
  function buildImage() {
    start('buildImage')
    const idFile = path.resolve(config.tmpDir, 'id')
    shell('docker', [
      'build',
      '--iidfile',
      idFile,
      '-t',
      imageName,
      '--file',
      config.dockerfile,
      config.tmpDir,
    ])
    return fs.readFileSync(idFile, { encoding: 'utf8' }).split(':')[1]
  }

  /**
   * run the webpack build
   */
  function buildNode() {
    start('buildNode')
    const p = fork(config.build.module, config.build.args, { stdio: 'inherit' })
    p.on('close', (code) => {
      if (code !== 0) throw new Error('build failed')
      fs.copyFileSync(
        config.build.output,
        path.resolve(config.tmpDir, path.basename(config.build.output))
      )
      tagImage(buildImage())
      dockerLogin()
      pushImage()
      // only release on non-arm systems
      if (!process.arch.startsWith('arm')) {
        herokuRelease()
      } else {
        console.log(yellow('Currently on ARM architecture; not releasing.'))
      }
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
