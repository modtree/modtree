import { container, getSource } from '../../../src/data-source'
import { User } from '../../../src/entity'
import { UserRepository } from '../../../src/repository'
import Init from '../../init'
import { setup, teardown } from '../../environment'
import { Flatten, oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => db.destroy().then(() => teardown(dbName)))

const t: Partial<{ user: User }> = {}

it('Saves a user', async () => {
  expect.assertions(1)
  const props = Init.emptyUser
  props.modulesDone.push('CS1101S')
  await container(db, () =>
    UserRepository(db)
      .initialize(props)
      .then((res) => {
        expect(res).toBeInstanceOf(User)
        t.user = res
      })
  )
})

it('Adds only modules which have pre-reqs cleared', async () => {
  // Get eligible modules
  expect.assertions(2)
  await container(db, () =>
    UserRepository(db)
      .eligibleModules(t.user)
      .then((eligibleModules) => {
        expect(eligibleModules).toBeInstanceOf(Array)
        const expected = ['CS2109S']
        /**
         * Compare module codes
         */
        const eligibleModuleCodes = eligibleModules.map(Flatten.module)
        expect(eligibleModuleCodes.sort()).toEqual(expected.sort())
      })
  )
})
