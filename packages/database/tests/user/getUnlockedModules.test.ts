import { container, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { UserRepository } from '../../src/repository'
import type * as InitProps from '../../types/init-props'
import Init from '../init'
import { setup, teardown } from '../environment'
import { oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const t: Partial<{
  user: User
  props: InitProps.User
}> = {
  props: Init.emptyUser,
}

it('Saves a user', async () => {
  t.props.modulesDone.push('CS1010')
  const res = await container(db, async () => {
    await UserRepository(db).initialize(t.props)
    return UserRepository(db).findOneByUsername(t.props.username)
  })
  expect(res).toBeDefined()
  if (!res) return
  t.user = res
})

it('Correctly gets unlocked modules', async () => {
  // Get unlocked modules for CS2100
  const modules = await container(db, () =>
    UserRepository(db).getUnlockedModules(t.user, 'CS2100')
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
  const res = await container(db, async () =>
    UserRepository(db).findOneById(t.user.id)
  )
  expect(res).toBeDefined()
  if (!res) return
  const modulesDoneCodes = res.modulesDone.map((one) => one.moduleCode)
  expect(modulesDoneCodes).toEqual(['CS1010'])
})

it('Returns empty array if module in User.modulesDone', async () => {
  // Get unlocked modules for CS1010, which is in User.modulesDone
  const modules = await container(db, () =>
    UserRepository(db).getUnlockedModules(t.user, 'CS1010')
  )
  expect(modules).toBeDefined()
  if (!modules) return
  expect(modules).toEqual([])
})
