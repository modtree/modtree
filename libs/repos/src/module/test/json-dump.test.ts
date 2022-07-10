import { setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'
import fs from 'fs'
import { resolve } from 'path'
import { Api } from '../../api'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const rootDir = resolve(__dirname, '../../../../..')
const outDir = resolve(rootDir, 'references')
const prettify = (s: any) => JSON.stringify(s, null, 2)

const outFile = {
  modules: resolve(outDir, 'modules.json'),
  condensed: resolve(outDir, 'modules-condensed.json'),
  codes: resolve(outDir, 'module-codes.json'),
  custom: resolve(outDir, 'custom.json'),
}
const write = <T extends keyof typeof outFile>(target: T, data: any) =>
  fs.writeFileSync(outFile[target], prettify(data))

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const main = () => {
  const api = new Api(db)
  const promises: Promise<any>[] = []
  promises.push(
    api.moduleRepo.find().then((data) => {
      write('modules', data)
      write(
        'custom',
        data.filter((m) =>
          ['MA1521', 'MA2001', 'ST2334'].includes(m.moduleCode)
        )
      )
    })
  )
  promises.push(
    api.moduleCondensedRepo.find().then((data) => {
      write('condensed', data)
      write(
        'codes',
        data.map((m) => m.moduleCode)
      )
    })
  )
  return Promise.allSettled(promises)
}

test('generate jsons', async () => {
  // await main()
  expect(1).toBe(1)
})
