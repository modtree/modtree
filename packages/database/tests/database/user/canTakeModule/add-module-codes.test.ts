import { container, getSource } from '@src/data-source'
import { init } from "@tests/init"
import { setup, teardown, Repo, t } from '@environment'
import { oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(init.emptyUser))
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
        Repo.User.canTakeModule(t.user, x, addModuleCodes)
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
        Repo.User.canTakeModule(t.user, x, addModuleCodes)
      )
    )
  })
  expect(res).toStrictEqual([false, false, false, true])
})
