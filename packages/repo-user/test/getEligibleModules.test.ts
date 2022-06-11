import { User } from '@modtree/entity'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { getUserRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db).then(() => {
  Repo.User = getUserRepository(db)
}))
afterAll(() => teardown(db))

it('Saves a user', async () => {
  expect.assertions(1)
  const props = init.emptyUser
  props.modulesDone.push('CS1101S')
  await container(db, () =>
    Repo.User.initialize(props).then((res) => {
      expect(res).toBeInstanceOf(User)
      t.user = res
    })
  )
})

it('Adds only modules which have pre-reqs cleared', async () => {
  // Get eligible modules
  expect.assertions(2)
  await container(db, () =>
    Repo.User.getEligibleModules(t.user).then((eligibleModules) => {
      expect(eligibleModules).toBeInstanceOf(Array)
      const expected = ['CS2109S']
      /**
       * Compare module codes
       */
      const eligibleModuleCodes = eligibleModules.map(flatten.module)
      expect(eligibleModuleCodes.sort()).toStrictEqual(expected.sort())
    })
  )
})