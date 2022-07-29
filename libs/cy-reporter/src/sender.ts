import './env'
import { cyan } from 'chalk'
import { Packet } from './types'
import { source } from '@modtree/typeorm-config'

const db = source.development
console.log(db.options)

// const init = db.initialize()

process.on('message', (packet: Packet) => {
  console.log('---> sender received message:', packet)
  // init.then(() => {
  //   const r = new Repository(CypressRun, db.manager)
  //   r.find().then(console.log)
  // })
})

process.on('disconnect', () => {
  console.log(cyan('Cypress sender has disconnected.'))
})
process.on('exit', () => {
  console.log(cyan('Cypress sender has left the building.'))
})
