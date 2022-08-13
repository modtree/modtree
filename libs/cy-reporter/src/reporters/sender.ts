import '../env'
import { CypressRun } from '../entity'
import { getCurrentHash } from '../git'
import { log, client } from '../utils'
import { EventEmitter } from 'events'
import { basename } from 'path'
import type { Packet } from '../types'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1'

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

  // add to write queue
  queue.push(
    client.post('/create', {
      file,
      gitHash,
      timestamp: Math.round(new Date(end).getTime() / 1000),
      pass: packet.data.stats.failures === 0,
    })
  )

  // release the lock
  lock = false
  bus.emit('unlocked')
}

process.on('message', (packet: Packet) => {
  // handle end of test (push data)
  if (packet.action === 'end') {
    handleTestEnd(packet)
  }
})

/**
 * triggered upon the parent of this fork disconnecting
 */
process.on('disconnect', () => {
  // execute after settling queue
  const settleQueue = () => {
    log.gray('waiting for result write requests to be resolved...')
    Promise.allSettled(queue).then((results) => {
      log.gray('result write requests resolved!')
      let [saved, passed] = [0, 0]
      results.forEach((res) => {
        if (res.status === 'fulfilled') {
          saved += 1
          passed += res.value.pass ? 1 : 0
        }
      })
      const pst = 'passed / saved / total: '
      log.normal(pst, passed, '/', saved, '/', results.length, '\n')
    })
  }
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
  log.gray(thisScript, 'has left the building.')
})
