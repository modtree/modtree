import { ModuleFull } from '@modtree/entity'
import { setup, teardown, Repo } from '@modtree/test-env'
import { db } from '@modtree/typeorm-config'
import { EntityNotFoundError } from 'typeorm'

beforeAll(() => setup(db))
afterAll(() => teardown(db))
let mod: ModuleFull

const testFn = (code: string) => Repo.ModuleFull.findOneByCode(code)

test('returns a full module', async () => {
  await testFn('CS1010S').then((res) => {
    expect(res).toBeInstanceOf(ModuleFull)
    mod = res
  })
})

test('valid module code', async () => {
  expect(mod.moduleCode).toEqual('CS1010S')
})

test('has a description', async () => {
  expect(mod.description.length).toBeGreaterThan(0)
  expect(typeof mod.description).toEqual('string')
})

test('invalid query', async () => {
  await expect(testFn('NOT_VALID')).rejects.toThrowError(EntityNotFoundError)
})
