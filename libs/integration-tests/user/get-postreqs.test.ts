import { Module, ModuleStatus } from '@modtree/types'
import { init, Repo, setup, t, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { flatten, oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(init.user1.email))
    .then((user) =>
      Repo.User.setModuleStatus(user, ['MA2001'], ModuleStatus.DONE)
    )
    .then((user) =>
      Repo.User.setModuleStatus(user, ['MA2101'], ModuleStatus.DOING)
    )
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('returns an array of modules', async () => {
  await Repo.User.getPostReqs(t.user!).then((res) => {
    res.forEach((module) => expect(module).toBeInstanceOf(Module))
  })
})

it("doesn't contain modules doing", async () => {
  await Repo.User.getPostReqs(t.user!).then((res) => {
    const codes = res.map(flatten.module)
    expect(codes).not.toContain('MA2101')
  })
})

it('gets correct post-reqs', async () => {
  await Promise.all([
    Repo.User.getPostReqs(t.user!),
    Repo.Module.findByCode('MA2001'),
  ]).then(([userPostReqs, module]) => {
    const postReqCodes = userPostReqs.map(flatten.module)
    const expectedCodes = module.fulfillRequirements
    expect([...postReqCodes, 'MA2101']).toIncludeSameMembers(expectedCodes)
  })
})

describe('handles empty fulfillRequirements', () => {
  beforeEach(expect.hasAssertions)

  it('CP2106.fulfillRequirements is empty', async () => {
    await Repo.Module.findByCode('CP2106').then((module) => {
      expect(module.fulfillRequirements).toEqual([])
    })
  })

  it('returns []', async () => {
    // init new user with CP2106
    // CP2106 has empty string fulfillRequirements
    await Repo.User.initialize(init.user2.email)
      .then((user) =>
        Repo.User.setModuleStatus(user, ['CP2106'], ModuleStatus.DONE)
      )
      .then((res) => Repo.User.getPostReqs(res))
      .then((postReqs) => {
        expect(postReqs).toStrictEqual([])
      })
  })
})
