import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleStatus } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(init.user1.email))
    .then((user) =>
      Repo.User.setModuleStatus(user, ['CS1101S'], ModuleStatus.DONE)
    )
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('adds correct modules', async () => {
  await Repo.User.getEligibleModules(t.user!).then((modules) => {
    const codes = modules.map(flatten.module)
    expect(codes).toIncludeSameMembers(['CS2109S'])
  })
})
