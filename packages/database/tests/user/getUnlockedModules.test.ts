import { container, getSource } from '../../src/data-source'
import { InitProps } from '../../types/init-props'
import Init from '../init'
import { setup, teardown, Repo, t } from '../environment'
import { Flatten, oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const userProps: InitProps['User'] = {
  ...Init.emptyUser,
  modulesDone: ['CS1010'],
}

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(userProps))
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
  const codes = modules.map(Flatten.module)
  expect(codes.sort()).toStrictEqual(expected.sort())
})

it('Does not modify User.modulesDone', async () => {
  // Also loads relations
  const res = await container(db, async () => Repo.User.findOneById(t.user.id))
  expect(res).toBeDefined()
  if (!res) return
  const modulesDoneCodes = res.modulesDone.map(Flatten.module)
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
