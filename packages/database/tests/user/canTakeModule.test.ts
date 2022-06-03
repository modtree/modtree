import { container, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { ModuleRepository, UserRepository } from '../../src/repository'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'

const dbName = 'test_user_canTakeModule'
const db = getSource(dbName)
const t: Partial<{ user: User }> = {}

beforeAll(() => setup(dbName))
afterAll(() => db.dropDatabase().then(() => db.destroy()))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

it('Saves a user', async () => {
  expect.assertions(1)
  const props = init.emptyUser
  props.modulesDone.push('MA2001')
  props.modulesDoing.push('MA2219')
  await container(db, () =>
    UserRepository(db)
      .initialize(props)
      .then((res) => {
        expect(res).toBeInstanceOf(User)
        t.user = res
      })
  )
})

it('Correctly handles modules not taken before', async () => {
  expect.assertions(1)
  await container(db, async () => {
    const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
    await Promise.all(
      modulesTested.map((x) => UserRepository(db).canTakeModule(t.user, x))
    ).then((res) => {
      expect(res).toStrictEqual([true, false, false, true])
    })
  })
})

it('Returns false for modules taken before/currently', async () => {
  await container(db, async () => {
    // one done, one doing
    const modulesTested = ['MA2001', 'MA2219']
    await Promise.all(
      modulesTested.map((x) => UserRepository(db).canTakeModule(t.user, x))
    ).then((res) => {
      expect(res).toStrictEqual([false, false])
    })
  })
})

it('Returns false if module code passed in does not exist', async () => {
  await container(db, () =>
    UserRepository(db)
      .canTakeModule(t.user, init.invalidModuleCode)
      .then((res) => {
        expect(res).toStrictEqual(false)
      })
  )
})
