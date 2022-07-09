import { db } from '@modtree/typeorm-config'
import { getApp } from './app'
import { DataSource, Repository } from 'typeorm'
import { Api } from '@modtree/repos'
import { ModuleFull } from '@modtree/types'

function checkhealth(db: DataSource) {
  const api = new Api(db)
  const modFullRepo = new Repository(ModuleFull, db.manager)
  const repos = [
    api.moduleRepo,
    api.moduleCondensedRepo,
    modFullRepo,
    api.userRepo,
    api.degreeRepo,
    api.graphRepo,
  ]
  Promise.all(repos.map((r) => r.count())).then((results) => {
    const names = ['Modules', 'Condensed', 'Full', 'Users', 'Degrees', 'Graphs']
    results.forEach((result, i) => {
      console.debug(names[i], result)
      if (names[i] === 'Users' && result < 3) {
        api.frontendSetup()
      }
    })
  })
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

console.debug('Initializing connection to database...')
console.debug(db.options)

const maxRetries = 12
let attempts = 1

async function attemptConnection() {
  return db.initialize().then(async (db) => {
    console.debug(
      `Connection to database [${db.options.database}] established.`
    )
    checkhealth(db)
    const api = new Api(db)
    const app = getApp(api)
    app.listen(process.env.PORT || 8080)
  })
}

let connect = attemptConnection()

for (let i = 0; i < maxRetries; i++) {
  connect = connect.catch(async () => {
    if (attempts === maxRetries) {
      console.debug('Max attempts reached')
    } else {
      console.debug('attempts', attempts)
      attempts += 1
      await sleep(5000)
      return attemptConnection()
    }
  })
}
