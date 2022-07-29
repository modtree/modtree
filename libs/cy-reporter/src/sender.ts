import 'dotenv/config'
import { cyan } from 'chalk'
import { Packet } from './types'
import { source } from '@modtree/typeorm-config'

console.log(source.development.options)

process.on('message', (packet: Packet) => {
  console.log('---> sender received message:', packet)
})

process.on('disconnect', () => {
  console.log(cyan('Cypress sender has disconnected.'))
})
process.on('exit', () => {
  console.log(cyan('Cypress sender has left the building.'))
})
