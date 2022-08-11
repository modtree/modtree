const { spawn } = require('child_process')
const web = spawn('yarn', ['dev:web'], { stdio: 'inherit' })
const server = spawn('yarn', ['dev:server'], { stdio: 'inherit' })

const wipe = () => {
  if (web) web.kill()
  if (server) server.kill()
}

process.on('SIGINT', () => wipe())
process.on('exit', () => wipe())
