/**
 * this test acts as a script that makes all fulfillRequirements into an array
 */

import { db } from '@modtree/typeorm-config'
import { Api } from '@modtree/repos'
import { IModule } from '@modtree/types'
import { DataSource, DataSourceOptions } from 'typeorm'
import { env } from 'libs/typeorm-config/src/env'

const { ssl, ...rest } = env.development
const opts: DataSourceOptions = {
  type: 'postgres',
}

Object.assign(opts, db.options)
Object.assign(opts, rest)
Object.assign(opts, { synchronize: false })

const noSync = new DataSource(opts)
console.log(noSync.options)
const connect = noSync.initialize()

const getApi = connect.then((db) => new Api(db))

const main = getApi.then(async (api) => {
  let count = 0
  let stringCount = 0
  const moduleRepo = api.moduleRepo
  const getModules = moduleRepo.find()
  const saves: Promise<IModule>[] = []
  const getSaves = getModules.then((modules) => {
    modules.forEach((module) => {
      const f = module.fulfillRequirements as any
      const isString = typeof f === 'string'
      const isBlank = f === ''
      const isArray = Array.isArray(f)
      if (!isArray && isString && isBlank) {
        module.fulfillRequirements = []
        // saves.push(moduleRepo.save(module))
        count += 1
      }
      if (isString) {
        stringCount += 1
      }
    })
    console.log('module.fulfillRequirements')
    console.log('modified count:', count)
    console.log('string count:', stringCount)
  })
  return getSaves.then(() => Promise.all(saves))
})

const end = main.finally(() => {
  if (noSync.isInitialized) {
    return noSync.destroy()
  }
  return
})

jest.setTimeout(600000)
test('end', async () => {
  await end
  expect(1).toBe(1)
})
