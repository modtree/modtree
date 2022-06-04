import { container, endpoint, getSource } from '../../../src/data-source'
import { Module, User } from '../../../src/entity'
import { ModuleRepository, UserRepository } from '../../../src/repository'
import { Init } from '../../../types/entity'
import { init } from '../../init'
import { setup, importChecks, teardown } from '../../environment'

const dbName = 'test_user_eligibleModules_add_module_codes'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

let user: User
it('Saves an empty user', async () => {
  const props: Init.UserProps = init.emptyUser
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
  const addModuleCodes = ['CS1101S']
  // Get eligible modules
  const eligibleModules = await endpoint(db, () =>
    container(db, () => UserRepository(db).eligibleModules(user, addModuleCodes))
  )
  expect(eligibleModules).toBeDefined()
  if (!eligibleModules) return
  const expected = ['CS2109S']
  // Compare module codes
  const eligibleModuleCodes = eligibleModules.map((one: Module) => one.moduleCode)
  expect(eligibleModuleCodes.sort()).toEqual(expected.sort())
})
