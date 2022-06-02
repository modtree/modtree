import { container, endpoint, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { ModuleRepository, UserRepository } from '../../src/repository'
import { Init } from '../../types/entity'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'

const dbName = 'test_user_eligibleModules'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

jest.setTimeout(20000)

let user: User
it('Saves a user', async () => {
  const props: Init.UserProps = init.emptyUser
  props.modulesDone.push('CS1101S')
  const res = await endpoint(db, () =>
    container(db, async () => {
      await UserRepository(db).initialize(props)
      return await UserRepository(db).findOneByUsername(props.username)
    })
  )
  expect(res).toBeDefined()
  if (!res) return
  user = res
})

it('Adds only modules which have pre-reqs cleared', async () => {
  // Get eligible modules
  const eligibleModules = await endpoint(db, () =>
    container(db, () => UserRepository(db).eligibleModules(user))
  )
  expect(eligibleModules).toBeDefined()
  if (!eligibleModules) return
  const expected = ['CS2109S']
  // Compare module codes
  const eligibleModuleCodes = eligibleModules.map((one: Module) => one.moduleCode)
  expect(eligibleModuleCodes.sort()).toEqual(expected.sort())
  expect(eligibleModuleCodes.length).toEqual(expected.length)
})
