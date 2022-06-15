import { InitProps } from '@modtree/types'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { UserRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const userProps: InitProps['User'] = {
  ...init.emptyUser,
  modulesDone: ['CS1010'],
}

beforeAll(() =>
  setup(db)
    .then(() => {
      Repo.User = new UserRepository(db)
      return Repo.User!.initialize(userProps)
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Correctly gets unlocked modules', async () => {
  // Get unlocked modules for CS2100
  expect.hasAssertions()
  await Repo.User!.getUnlockedModules(t.user!, 'CS2100').then((modules) => {
    // Notice that this does not include all CS2100 post-reqs
    const expected = ['CS2106', 'CS3210', 'CS3237']
    // Compare module codes
    const codes = modules.map(flatten.module)
    expect(codes.sort()).toStrictEqual(expected.sort())
  })
})

it('Does not modify User.modulesDone', async () => {
  // Also loads relations
  expect.hasAssertions()
  await Repo.User!.findOneById(t.user!.id).then((res) => {
    const modulesDoneCodes = res.modulesDone.map(flatten.module)
    expect(modulesDoneCodes).toEqual(['CS1010'])
  })
})

it('Returns empty array if module in User.modulesDone', async () => {
  // Get unlocked modules for CS1010, which is in User.modulesDone
  expect.hasAssertions()
  await Repo.User!.getUnlockedModules(t.user!, 'CS1010').then((modules) => {
    expect(modules).toEqual([])
  })
})
