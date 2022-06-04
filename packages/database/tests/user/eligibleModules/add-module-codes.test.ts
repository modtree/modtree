import { container, getSource } from '../../../src/data-source'
import { Module, User } from '../../../src/entity'
import { UserRepository } from '../../../src/repository'
import { Init } from '../../../types/entity'
import { init } from '../../init'
import { setup, teardown } from '../../environment'
import { oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ user: User }> = {}

beforeAll(() => setup(dbName))
afterAll(() => db.destroy().then(() => teardown(dbName)))

it('Saves an empty user', async () => {
  const props: Init.UserProps = init.emptyUser
  const res = await container(db, async () => {
    await UserRepository(db).initialize(props)
    return await UserRepository(db).findOneByUsername(props.username)
  })
  expect(res).toBeDefined()
  if (!res) return
  t.user = res
})

it('Adds only modules which have pre-reqs cleared', async () => {
  const addModuleCodes = ['CS1101S']
  // Get eligible modules
  const eligibleModules = await container(db,
    () => UserRepository(db).eligibleModules(t.user, addModuleCodes)
  )
  expect(eligibleModules).toBeDefined()
  if (!eligibleModules) return
  const expected = ['CS2109S']
  // Compare module codes
  const eligibleModuleCodes = eligibleModules.map((one: Module) => one.moduleCode)
  expect(eligibleModuleCodes.sort()).toEqual(expected.sort())
})
