import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { UserRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      Repo.User = new UserRepository(db)
      return Repo.User!.initialize({
        ...init.user1,
        modulesDone: ['CS1101S'],
      })
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))
beforeEach(expect.hasAssertions)

it('Adds only modules which have pre-reqs cleared', async () => {
  // Get eligible modules
  await Repo.User!.getEligibleModules(t.user!).then((eligibleModules) => {
    // expect(eligibleModules).toBeInstanceOf(Array)
    const expected = ['CS2109S']
    /**
     * Compare module codes
     */
    const eligibleModuleCodes = eligibleModules.map(flatten.module)
    expect(eligibleModuleCodes).toIncludeSameMembers(expected)
  })
})
