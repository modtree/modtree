import { container, endpoint, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { ModuleRepository, UserRepository } from '../../src/repository'
import { Init } from '../../types/entity'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'

const dbName = 'test_user_getPotentialModules'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

jest.setTimeout(20000)

let user: User
const props: Init.UserProps = init.emptyUser

it('Saves a user', async () => {
  props.modulesDone.push('CS1010')
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

it('Correctly gets potential modules', async () => {
  // Get potential modules for CS2100
  const modules = await endpoint(db, () =>
    container(db, () => UserRepository(db).getPotentialModules(user, 'CS2100'))
  )
  expect(modules).toBeDefined()
  if (!modules) return
  // Notice that this does not include all CS2100 post-reqs
  const expected = ['CS2106', 'CS3210', 'CS3237']
  // Compare module codes
  const codes = modules.map((one: Module) => one.moduleCode)
  expect(codes.sort()).toEqual(expected.sort())
})

it('Does not modify User.modulesDone', async () => {
  // Also loads relations
  const res = await endpoint(db, () =>
    container(db, async () => {
      return await UserRepository(db).findOneById(user.id)
    })
  )
  expect(res).toBeDefined()
  if (!res) return
  const modulesDoneCodes = res.modulesDone.map((one) => one.moduleCode)
  expect(modulesDoneCodes).toEqual(['CS1010'])
})

it('Returns empty array if module in User.modulesDone', async () => {
  // Get potential modules for CS1010, which is in User.modulesDone
  const modules = await endpoint(db, () =>
    container(db, () => UserRepository(db).getPotentialModules(user, 'CS1010'))
  )
  expect(modules).toBeDefined()
  if (!modules) return
  expect(modules).toEqual([])
})

