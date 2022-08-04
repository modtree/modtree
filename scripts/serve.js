const { spawn } = require('child_process')

spawn('yarn', ['dev:web'], { stdio: 'inherit' })
spawn('yarn', ['dev:server'], { stdio: 'inherit' })
