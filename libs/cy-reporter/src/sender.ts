import './env'
import { Packet } from './types'
import { init, db } from './data-source'
import { CypressRun } from './entity'
import { getCurrentHash } from './git'
import { log } from './log'
import { EventEmitter } from 'events'
import { basename } from 'path'

/**
 * mini mutex
 *
 * this is a child fork that expect two main signals:
 *  1. 'message'
 *  2. 'disconnect'
 *
 * 'message' receives a data packet which will be pushed to the write
 * queue.
 *
 * 'disconnect' will trigger a Promise.allSettled() on the write
 * queue, and closes the script after it resolves.
 *
 * This requires the queue to be fully filled BEFORE
 * Promise.allSettled() is called on it.
 *
 * This lock is activated upon receiving 'message', and unlocked after
 * the data packet has been written to the queue.
 *
 * This works because 'disconnect' is guaranteed to be received after
 * the last 'message'.
 */
const bus = new EventEmitter()
let lock = false

// write queue
const queue: Promise<CypressRun>[] = []

const handleTestEnd = (packet: Packet) => {
  // lock the queue
  lock = true

  // entity data
  const file = packet.data.file
  const end = packet.data.stats.end
  const gitHash = getCurrentHash()

  // data validation
  if (!file) {
    log.error('test run has no filename.')
    return
  }
  if (!end) {
    log.error('test run has no end timestamp.')
    return
  }

  // push to the write queue
  init.then((repo) => {
    const timestamp = Math.round(new Date(end).getTime() / 1000)
    const pass = packet.data.stats.failures === 0
    const run = repo.create({ file, timestamp, gitHash, pass })
    queue.push(repo.save(run))
    // unlock the queue
    lock = false
    bus.emit('unlocked')
  })
}

process.on('message', (packet: Packet) => {
  // handle end of test (push data)
  if (packet.action === 'end') {
    handleTestEnd(packet)
  }
  // quick log
  ;({
    start: () => log.start(packet.data.file),
    end: () => log.end(packet.data.file),
  }[packet.action]())
})

/**
 * triggered upon the parent of this fork disconnecting
 */
process.on('disconnect', () => {
  // execute after settling queue
  const settleQueue = () =>
    Promise.allSettled(queue).then((results) => {
      let [fulfilled, passed] = [0, 0]
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          fulfilled += 1
          passed += res.value.pass ? 1 : 0
        }
      })
      const psf = 'passed / saved / total: '
      log.normal(psf, passed, '/', fulfilled, '/', results.length, '\n')
      return db.isInitialized ? db.destroy() : null
    })
  // wait for lock to be gone
  if (lock) {
    bus.once('unlocked', () => settleQueue())
  } else {
    settleQueue()
  }
})

/**
 * exit catcher
 * triggered on this script exiting, including forcefully with SIGINT (ctrl C)
 */
process.on('exit', () => {
  const thisScript = basename(__dirname) + '/' + basename(__filename)
  log.normal(thisScript, 'has left the building.')
  // shut down the database
  const no = () => log.red('Database connection is still running.')
  if (db.isInitialized) {
    return db.destroy().catch(() => no())
  }
})
