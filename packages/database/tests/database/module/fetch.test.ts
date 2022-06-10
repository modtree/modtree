import { Module } from '@modtree/entity'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
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
