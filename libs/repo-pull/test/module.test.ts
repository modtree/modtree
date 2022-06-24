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
  await moduleRepo.deleteAll()
})

test('pull all modules from NUSMods', async () => {
  moduleRepo.pull().then((res: Module[]) => {
    expect(res).toBeArrayOf(Module)
    expect(res.length).toBeGreaterThan(6000)
  })
})
