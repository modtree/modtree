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
    modFullRepo,
    api.userRepo,
    api.degreeRepo,
    api.graphRepo,
  ]
  Promise.all(repos.map((r) => r.count())).then((results) => {
    const names = ['Modules', 'Condensed', 'Full', 'Users', 'Degrees', 'Graphs']
    results.forEach((result, i) => {
      console.debug(names[i], result)
    })
  })
}

console.debug('Initializing connection to database...')
db.initialize()
  .then(async () => {
    console.debug(
      `Connection to database [${db.options.database}] established.`
    )
    checkhealth(db)
    const api = new Api(db)
    const app = getApp(api)
    app.listen(process.env.PORT || 8080)
  })
  .catch((err) => {
    console.debug(err, 'Failed to initialize connection to database.')
  })
