import { container, getSource } from '../../../src/data-source'
import { Module, User } from '../../../src/entity'
import { UserRepository } from '../../../src/repository'
import Init from '../../init'
import { setup, teardown } from '../../environment'
import { oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ user: User }> = {}

beforeAll(() =>
  setup(db)
    .then(() =>
      UserRepository(db).initialize(Init.emptyUser),
    )
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Adds only modules which have pre-reqs cleared', async () => {
  const addModuleCodes = ['CS1101S']
  // Get eligible modules
  const eligibleModules = await container(db, () =>
    UserRepository(db).eligibleModules(t.user, addModuleCodes)
  )
  expect(eligibleModules).toBeDefined()
  if (!eligibleModules) return
  const expected = ['CS2109S']
  // Compare module codes
  const eligibleModuleCodes = eligibleModules.map(
    (one: Module) => one.moduleCode
  )
  expect(eligibleModuleCodes.sort()).toStrictEqual(expected.sort())
})
