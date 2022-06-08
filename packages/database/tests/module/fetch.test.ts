import { container, getSource } from '@src/data-source'
import { Module } from '@entity'
import { oneUp } from '@utils'
import {  setup, teardown, Repo } from '@environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

test('fetch one module from NUSMods', async () => {
  const res = await container(db, () =>
    Repo.Module.fetchOne('CS2040S')
  )
  expect(res).toBeInstanceOf(Module)
})
