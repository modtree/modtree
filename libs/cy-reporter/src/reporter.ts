import type { Packet, Runner } from './types'
import { fork } from 'child_process'
import { green, red } from 'chalk'

const log = {
  pass: (...a: any) => console.log(green('pass', ...a)),
  fail: (...a: any) => console.log(red('fail', ...a)),
}

const sender = fork('reporters/sender', [], {
  detached: true,
})

// core logic
export const main = (runner: Runner) => {
  // start forked process for sender
  // path given here is relative to apps/web-e2e

  // package data to send to sender
  const send = (action: Packet['action']) =>
    sender.send({
      action,
      data: { stats: runner.stats, file: runner.suite.file },
    })
  // send data to postgres
  runner.once('end', () => send('end'))
  runner.once('start', () => send('start'))
  // intermittent stuff
  runner.on('pass', (t) => log.pass(t.fullTitle()))
  runner.on('fail', (t, err) => log.fail(t.fullTitle(), '→', err.message))

  // upon the reporter script (this script) exiting,
  // disconnect the sender to allow it to gracefully exit too
}

process.on('exit', () => {
  if (sender && sender.connected) {
    sender.disconnect()
  }
})

/**
 * the reporter class
 * the constructor is called upon the execution of a reported test
 */
export class Reporter {
  constructor(runner: Runner) {
    main(runner)
  }
}
