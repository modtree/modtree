import type { Packet, Runner } from './types'
import { fork } from 'child_process'
import { log } from './log'

/**
 * fork a sender process that will handle async operations
 * (path given here is relative to the cypress project, in
 * this case is apps/web-e2e)
 *
 * because of this relative declaration, this file is only
 * meant to be ran automatically by cypress.
 *
 * running this file by node standalone will throw and error
 * for resolving the path of the forked process.
 */
const sender = fork('reporters/sender', [], { detached: true })

export const main = (runner: Runner) => {
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
}

/**
 * upon the reporter script (this script) exiting,
 * disconnect the sender to allow it to gracefully exit too
 */
process.on('exit', () => {
  if (sender.connected) sender.disconnect()
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
