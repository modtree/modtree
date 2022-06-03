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

let user: User
it('Saves a user', async () => {
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

it('Returns true for modules unlocked by the added modules', async () => {
  const addModuleCodes = ['MA2001']
  const res = await endpoint(db, () =>
    container(db, async () => {
      const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
      return Promise.all(
        modulesTested.map((x) => UserRepository(db).canTakeModule(user, x, addModuleCodes))
      )
    })
  )
  expect(res).toStrictEqual([true, false, false, true])
})

it('Returns false for modules unlocked by the added modules, if not passed in', async () => {
  const addModuleCodes = []
  const res = await endpoint(db, () =>
    container(db, async () => {
      const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
      return Promise.all(
        modulesTested.map((x) => UserRepository(db).canTakeModule(user, x, addModuleCodes))
      )
    })
  )
  expect(res).toStrictEqual([false, false, false, true])
})
