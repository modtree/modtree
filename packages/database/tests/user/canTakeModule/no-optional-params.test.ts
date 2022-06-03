import { container, endpoint, getSource } from '../../../src/data-source'
import { Module, User } from '../../../src/entity'
import { ModuleRepository, UserRepository } from '../../../src/repository'
import { Init } from '../../../types/entity'
import { init } from '../../init'
import { setup, importChecks, teardown } from '../../environment'

const dbName = 'test_user_canTakeModule_no_optional_params'
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
  props.modulesDone.push('MA2001')
  props.modulesDoing.push('MA2219')
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

it('Correctly handles modules not taken before', async () => {
  const res = await endpoint(db, () =>
    container(db, async () => {
      const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
      return Promise.all(
        modulesTested.map((x) => UserRepository(db).canTakeModule(user, x))
      )
    })
  )
  expect(res).toStrictEqual([true, false, false, true])
})

it('Returns false for modules taken before/currently', async () => {
  const res = await endpoint(db, () =>
    container(db, async () => {
      // one done, one doing
      const modulesTested = ['MA2001', 'MA2219']
      return Promise.all(
        modulesTested.map((x) => UserRepository(db).canTakeModule(user, x))
      )
    })
  )
  expect(res).toStrictEqual([false, false])
})

it('Returns false if module code passed in does not exist', async () => {
  const res = await endpoint(db, () =>
    container(db, () => UserRepository(db).canTakeModule(user, init.invalidModuleCode))
  )
  expect(res).toStrictEqual(false)
})
