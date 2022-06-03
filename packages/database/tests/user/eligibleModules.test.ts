import { container, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { ModuleRepository, UserRepository } from '../../src/repository'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'
import { flatten } from '../../src/utils'

const dbName = 'test_user_eligibleModules'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

const t: Partial<{user: User}> = {}

it('Saves a user', async () => {
  expect.assertions(1)
  const props = init.emptyUser
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
        const eligibleModuleCodes = eligibleModules.map(flatten.module)
        expect(eligibleModuleCodes.sort()).toEqual(expected.sort())
      })
  )
  await db.destroy()
})
