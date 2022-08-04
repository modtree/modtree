require('dotenv/config')
const { spawn } = require('child_process')
const path = require('path')

const herokuProject = 'modtree-cy-repoter'
const herokuRegistry = 'registry.heroku.com'
const herokuImage = `${herokuRegistry}/${herokuProject}/web`

const p = spawn(
  path.resolve(__dirname, 'push.sh'),
  [process.env['HEROKU_API_KEY'], herokuImage],
  { stdio: 'inherit' }
  // (err, stdout, stderr) => {
  //   if (err) {
  //     throw new Error(err)
  //   }
  //   console.log('stdout:',stdout)
  //   console.log('stderr:',stderr)
  // }
)

p.on('close', (code) => {
  console.log('closed with', code)
})
