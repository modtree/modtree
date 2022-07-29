import { writeFileSync, readFileSync } from 'fs'
import { getCurrentHash } from '../utils'
import type { Runner } from './types'
import type { TestData, Run } from './types'

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

class Reporter {
  constructor(runner: Runner) {
    runner
      .once('start', () => log('start'))
      .once('end', () => {
        endOfTest(runner)
        const stats = runner.stats
        if (!stats) return
        log(`end: ${stats.passes}/${stats.passes + stats.failures} ok`)
      })
      .on('pass', (t) => log(`pass: ${t.fullTitle()}`))
      .on('fail', (t, err) => log(`fail: ${t.fullTitle()} → ${err.message}`))
  }
}

module.exports = Reporter
