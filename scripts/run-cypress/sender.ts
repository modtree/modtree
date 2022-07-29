import 'dotenv/config'
import { cyan } from 'chalk'
import { Packet } from './types'
import { db } from './db'

console.log(db.options)

// const connection = db.initialize()

process.on('message', (packet: Packet) => {
  console.log('---> sender received message:', packet)
})

process.on('disconnect', () => {
  console.log(cyan('Cypress sender has disconnected.'))
})
process.on('exit', () => {
  console.log(cyan('Cypress sender has left the building.'))
})
