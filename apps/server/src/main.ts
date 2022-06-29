import { db } from '@modtree/typeorm-config'
import { getApp } from './app'
import { DataSource, Repository } from 'typeorm'
import { Api } from '@modtree/repo-api'
import { ModuleFull } from '@modtree/entity'

function checkhealth(db: DataSource) {
  const api = new Api(db)
  const modFullRepo = new Repository(ModuleFull, db.manager)
  const repos = [
    api.moduleRepo,
    api.moduleCondensedRepo,
    api.userRepo,
    api.degreeRepo,
    api.graphRepo,
  ]
  Promise.all(repos.map((r) => r.count())).then((results) => {
    const names = ['Modules', 'Condensed', 'Users', 'Degrees', 'Graphs']
    results.forEach((result, i) => {
      console.log(names[i], result)
    })
  })
  modFullRepo.count().then(console.log)
}

console.log('Initializing connection to database...')
db.initialize()
  .then(async () => {
    console.log(`Connection to database [${db.options.database}] established.`)
    checkhealth(db)
    const api = new Api(db)
    const app = getApp(api)
    app.listen(process.env.PORT || 8080)
  })
  .catch((err) => {
    console.log(err)
    console.log('Failed to initialize connection to database.')
  })
