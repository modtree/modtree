import { Module } from '@modtree/entity'
import { oneUp, getSource } from '@modtree/utils'
import { setup, teardown, Repo } from '@environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

test('fetch one module from NUSMods', async () => {
  expect.hasAssertions()
  await Repo.Module.fetchOne('CS2040S').then((res) => {
    expect(res).toBeInstanceOf(Module)
  })
})
