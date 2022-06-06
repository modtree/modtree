import { container, getSource } from '../../../src/data-source'
import Init from '../../init'
import { setup, teardown, repo, t } from '../../environment'
import { Flatten, oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => repo.User.initialize(Init.emptyUser))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Adds only modules which have pre-reqs cleared', async () => {
  const addModuleCodes = ['CS1101S']
  // Get eligible modules
  const eligibleModules = await container(db, () =>
    repo.User.getEligibleModules(t.user, addModuleCodes)
  )
  expect(eligibleModules).toBeDefined()
  if (!eligibleModules) return
  const expected = ['CS2109S']
  // Compare module codes
  const eligibleModuleCodes = eligibleModules.map(Flatten.module)
  expect(eligibleModuleCodes.sort()).toStrictEqual(expected.sort())
})
