import { Module } from '@modtree/entity'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo } from '@modtree/test-env'
import { ModuleRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.Module = new ModuleRepository(db)
  })
)
afterAll(() => teardown(db))

test('fetch one module from NUSMods', async () => {
  expect.hasAssertions()
  await Repo.Module!.fetchOne('CS2040S').then((res) => {
    expect(res).toBeInstanceOf(Module)
  })
})
