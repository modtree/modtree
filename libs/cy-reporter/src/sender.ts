import './env'
import { Packet } from './types'
import { config } from '@modtree/typeorm-config'
import { DataSource, Repository } from 'typeorm'
import { CypressRun } from './entity'
import { getCurrentHash } from './git'
import { log, debugLog } from './log'
import { EventEmitter } from 'events'

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

// only use the CypressRun entity here
const db = new DataSource({ ...config.development, entities: [CypressRun] })

// initialize database and repo
const dbInit = db.initialize()
const repo = dbInit.then(() => new Repository(CypressRun, db.manager))
const init = Promise.all([repo, dbInit]).then(([repo]) => repo)

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

  return init.then(async (repo) => {
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
  if (['start', 'end'].includes(packet.action)) {
    log.cyan(`test ${packet.action}:`, packet.data.file)
  }
  if (packet.action === 'end') handleTestEnd(packet)
})

/**
 * triggered upon the parent of this fork disconnecting
 */
process.on('disconnect', () => {
  debugLog.cyan('Cypress reporter has disconnected.')
  log.cyan('Cypress sender is wrapping up...')
  // execute after settling queue
  const settleQueue = () =>
    Promise.allSettled(queue).then((results) => {
      const total = results.length
      const fulfilled = results.filter(
        (res) => res.status === 'fulfilled'
      ).length
      log.cyan('total tests ran:', total)
      log.cyan('tests recorded: ', fulfilled)
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
  log.cyan('Cypress sender has left the building.')
  // shut down the database
  const ok = () => debugLog.green('Database connection is shut down.')
  const no = () => log.red('Database connection is still running.')
  if (db.isInitialized) {
    return db
      .destroy()
      .then(() => ok())
      .catch(() => no())
  } else {
    ok()
  }
})
