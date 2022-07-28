/**
 * this test acts as a script that makes all aliases into an array
 */

import { db, env } from '@modtree/typeorm-config'
import { Api } from '@modtree/repos'
import { IModule } from '@modtree/types'
import { DataSource, DataSourceOptions } from 'typeorm'
import { z } from 'zod'

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
  const moduleRepo = api.moduleFullRepo
  const getModules = moduleRepo.find()
  const saves: Promise<IModule>[] = []
  const getSaves = getModules.then((modules) => {
    modules.forEach((m) => {
      const r1 = z.array(z.string()).safeParse(m.aliases)
      const r2 = z.array(z.string()).safeParse(m.fulfillRequirements)
      expect(r1).toEqual(expect.objectContaining({ success: true }))
      expect(r2).toEqual(expect.objectContaining({ success: true }))
    })
    ;['aliases', 'fulfillRequirements'].forEach((key) => {
      modules.forEach((module: any) => {
        const f = module[key] as any
        const isString = typeof f === 'string'
        const isBlank = f === ''
        const isArray = Array.isArray(f)
        if (!isArray && isString && isBlank) {
          module[key] = []
          // saves.push(moduleRepo.save(module))
          count += 1
        }
        if (isString) {
          stringCount += 1
        }
      })
    })
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
