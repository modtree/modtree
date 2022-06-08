import { container, getSource } from '@src/data-source'
import { init } from '@tests/init'
import { setup, teardown, Repo, t } from '@environment'
import { flatten, oneUp } from '@utils'

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

it('Adds only modules which have pre-reqs cleared', async () => {
  const addModuleCodes = ['CS1101S']
  // Get eligible modules
  const eligibleModules = await container(db, () =>
    Repo.User.getEligibleModules(t.user, addModuleCodes)
  )
  expect(eligibleModules).toBeDefined()
  if (!eligibleModules) return
  const expected = ['CS2109S']
  // Compare module codes
  const eligibleModuleCodes = eligibleModules.map(flatten.module)
  expect(eligibleModuleCodes.sort()).toStrictEqual(expected.sort())
})
