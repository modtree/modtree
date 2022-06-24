import { Module } from '@modtree/entity'
import { setup, teardown } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleRepository } from '../src/Module'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let moduleRepo: any

beforeAll(() =>
  setup(db).then(() => {
    moduleRepo = new ModuleRepository(db)
  })
)
afterAll(() => teardown(db))

jest.setTimeout(60000)

test('clear existing modules', async () => {
  await moduleRepo
    .deleteAll()
    .then(() => moduleRepo.count())
    .then((count: number) => expect(count).toEqual(0))
})

test('pull 50 modules from NUSMods', async () => {
  const limit = 50
  await moduleRepo.pull(limit).then((res: Module[]) => {
    expect(res).toBeArrayOf(Module)
    expect(res.length).toBeGreaterThanOrEqual(limit)
  })
})
