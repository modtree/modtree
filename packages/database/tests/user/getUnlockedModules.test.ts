import { container, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { InitProps } from '../../types/init-props'
import Init from '../init'
import { repo, setup, teardown } from '../environment'
import { copy, oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ user: User }> = {}
const userProps: InitProps['User'] = {
  ...Init.emptyUser,
  modulesDone: ['CS1010'],
}

beforeAll(() =>
  setup(db)
    .then((res) => copy(res, repo))
    .then(() => repo.User.initialize(userProps))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Correctly gets unlocked modules', async () => {
  // Get unlocked modules for CS2100
  const modules = await container(db, () =>
    repo.User.getUnlockedModules(t.user, 'CS2100')
  )
  expect(modules).toBeDefined()
  if (!modules) return
  // Notice that this does not include all CS2100 post-reqs
  const expected = ['CS2106', 'CS3210', 'CS3237']
  // Compare module codes
  const codes = modules.map((one: Module) => one.moduleCode)
  expect(codes.sort()).toStrictEqual(expected.sort())
})

it('Does not modify User.modulesDone', async () => {
  // Also loads relations
  const res = await container(db, async () => repo.User.findOneById(t.user.id))
  expect(res).toBeDefined()
  if (!res) return
  const modulesDoneCodes = res.modulesDone.map((one) => one.moduleCode)
  expect(modulesDoneCodes).toEqual(['CS1010'])
})

it('Returns empty array if module in User.modulesDone', async () => {
  // Get unlocked modules for CS1010, which is in User.modulesDone
  const modules = await container(db, () =>
    repo.User.getUnlockedModules(t.user, 'CS1010')
  )
  expect(modules).toBeDefined()
  if (!modules) return
  expect(modules).toEqual([])
})
