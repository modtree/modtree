import { fork } from 'child_process'
import { writeFileSync, readFileSync } from 'fs'
import { getCurrentHash } from '../utils'
import type { Runner } from 'mocha'
import type { TestData, Run, Packet } from './types'

const filepath = 'results.json'
const log = console.log
const historyLength = 50

function endOfTest(runner: Runner) {
  const gitHash = getCurrentHash()
  if (gitHash === '') return
  const json: TestData[] = JSON.parse(readFileSync(filepath, 'utf8'))
  const stats = runner.stats
  const file = runner.suite.file
  if (!file || !stats) return

  /**
   * read current file data from json
   * if it's not found, then create a new blank entry
   */
  const fileData = json.find((t) => t.file === file) || {
    file,
    runs: [] as Run[],
  }

  /**
   * push the status of the current test run
   */
  fileData.runs = [
    {
      gitHash,
      timestamp: new Date().getTime(),
      pass: stats.failures === 0,
    },
    ...fileData.runs,
  ]
  if (fileData.runs.length > historyLength) fileData.runs.pop()

  /**
   * push the file's data back into the json data
   */
  const final = [...json.filter((t) => t.file !== file), fileData]

  /**
   * update the json file
   */
  if (Array.isArray(final)) {
    writeFileSync(filepath, JSON.stringify(final, null, 2))
  }
}

// start forked process for sender
const sender = fork('reporters/sender', [], { detached: true })

// core logic
const main = (runner: Runner) => {
  // package data to send to sender
  const send = (action: Packet['action']) =>
    sender.send({
      action,
      data: { stats: runner.stats, file: runner.suite.file },
    })
  // send data to postgres
  runner.once('end', () => send('end'))
  runner.once('start', () => send('start'))
}

/**
 * the reporter class
 * the constructor is called upon the execution of a reported test
 */
class Reporter {
  constructor(runner: Runner) {
    main(runner)
    // intermittent stuff
    runner.on('pass', (t) => log('pass:', t.fullTitle()))
    runner.on('fail', (t, err) => log('fail:', t.fullTitle(), '→', err.message))
  }
}

// upon the reporter script (this script) exiting,
// disconnect the sender to allow it to gracefully exit too
process.on('exit', () => sender.disconnect())

module.exports = Reporter
