import { db } from '@modtree/typeorm-config'
import {
  ModuleRepository,
  ModuleCondensedRepository,
} from '@modtree/repo-module'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'
import { GraphRepository } from '@modtree/repo-graph'
import { getApp } from './server/app'
import { DataSource } from 'typeorm'

function checkhealth(db: DataSource) {
  const repos = [
    new ModuleRepository(db),
    new ModuleCondensedRepository(db),
    new UserRepository(db),
    new DegreeRepository(db),
    new GraphRepository(db),
  ]
  Promise.all(repos.map((r) => r.count())).then((results) => {
    const names = ['Modules', 'Condensed', 'Users', 'Degrees', 'Graphs']
    results.forEach((result, i) => {
      console.log(names[i], result)
    })
  })
}

console.log('Initializing connection to database...')
db.initialize()
  .then(async () => {
    console.log('Connection to database established.')
    checkhealth(db)
    const app = getApp()
    app.listen(process.env.PORT || 8080)
  })
  .catch((err) => {
    console.log(err)
    console.log('Failed to initialize connection to database.')
  })
