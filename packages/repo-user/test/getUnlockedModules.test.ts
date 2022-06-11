import { InitProps } from '@modtree/types'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { getUserRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const userProps: InitProps['User'] = {
  ...init.emptyUser,
  modulesDone: ['CS1010'],
}

beforeAll(() =>
  setup(db)
    .then(() => {
      Repo.User = getUserRepository(db)
      return Repo.User.initialize(userProps)
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Correctly gets unlocked modules', async () => {
  // Get unlocked modules for CS2100
  const modules = await container(db, () =>
    Repo.User.getUnlockedModules(t.user, 'CS2100')
  )
  expect(modules).toBeDefined()
  if (!modules) return
  // Notice that this does not include all CS2100 post-reqs
  const expected = ['CS2106', 'CS3210', 'CS3237']
  // Compare module codes
  const codes = modules.map(flatten.module)
  expect(codes.sort()).toStrictEqual(expected.sort())
})

it('Does not modify User.modulesDone', async () => {
  // Also loads relations
  const res = await container(db, async () => Repo.User.findOneById(t.user.id))
  expect(res).toBeDefined()
  if (!res) return
  const modulesDoneCodes = res.modulesDone.map(flatten.module)
  expect(modulesDoneCodes).toEqual(['CS1010'])
})

it('Returns empty array if module in User.modulesDone', async () => {
  // Get unlocked modules for CS1010, which is in User.modulesDone
  const modules = await container(db, () =>
    Repo.User.getUnlockedModules(t.user, 'CS1010')
  )
  expect(modules).toBeDefined()
  if (!modules) return
  expect(modules).toEqual([])
})