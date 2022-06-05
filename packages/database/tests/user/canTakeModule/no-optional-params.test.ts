import { container, getSource } from '../../../src/data-source'
import { User } from '../../../src/entity'
import { UserRepository } from '../../../src/repository'
import Init from '../../init'
import { setup, teardown } from '../../environment'
import { oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ user: User }> = {}

beforeAll(() => setup(db))
afterAll(() => teardown(db))

it('Saves a user', async () => {
  expect.assertions(1)
  const props = Init.emptyUser
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
  expect.assertions(1)
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
  expect.assertions(1)
  await container(db, () =>
    UserRepository(db)
      .canTakeModule(t.user, Init.invalidModuleCode)
      .then((res) => {
        expect(res).toStrictEqual(false)
      })
  )
})
