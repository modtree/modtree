import { container, getSource } from '../../../src/data-source'
import { User } from '../../../src/entity'
import { UserRepository } from '../../../src/repository'
import Init from '../../init'
import { setup, teardown } from '../../environment'
import { oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ user: User }> = {}

beforeAll(() =>
  setup(db)
    .then(() => UserRepository(db).initialize(Init.emptyUser))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Returns true for modules unlocked by the added modules', async () => {
  const addModuleCodes = ['MA2001']
  const res = await container(db, async () => {
    const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
    return Promise.all(
      modulesTested.map((x) =>
        UserRepository(db).canTakeModule(t.user, x, addModuleCodes)
      )
    )
  })
  expect(res).toStrictEqual([true, false, false, true])
})

it('Returns false for modules unlocked by the added modules, if not passed in', async () => {
  const addModuleCodes = []
  const res = await container(db, async () => {
    const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
    return Promise.all(
      modulesTested.map((x) =>
        UserRepository(db).canTakeModule(t.user, x, addModuleCodes)
      )
    )
  })
  expect(res).toStrictEqual([false, false, false, true])
})
