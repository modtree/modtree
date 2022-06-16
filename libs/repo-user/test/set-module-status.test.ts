import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { UserRepository } from '../src'
import { ModuleStatus } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      Repo.User = new UserRepository(db)
      return Repo.User!.initialize(init.user1)
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

/**
 * @param {string[]} modulesDoneCodes
 * @param {string[]} modulesDoingCodes
 */
function expectUserModules(
  modulesDoneCodes: string[],
  modulesDoingCodes: string[]
) {
  const modulesDone = t.user!.modulesDone.map(flatten.module)
  const modulesDoing = t.user!.modulesDoing.map(flatten.module)
  expect(modulesDone).toIncludeSameMembers(modulesDoneCodes)
  expect(modulesDoing).toIncludeSameMembers(modulesDoingCodes)
}

/**
 * init.user1 has
 * modulesDone = ['MA2001']
 * modulesDoing = ['MA2219']
 *
 * This test covers all 6 cases of switching state between
 * done, doing, not taken.
 */

describe('User.setModuleStatus', () => {
  it('done -> doing -> done', async () => {
    expect.assertions(4)
    // done -> doing
    t.user = await Repo.User!.setModuleStatus(
      t.user!,
      'MA2001',
      ModuleStatus.DOING
    )
    expectUserModules([], ['MA2001', 'MA2219'])
    // doing -> done
    t.user = await Repo.User!.setModuleStatus(
      t.user!,
      'MA2001',
      ModuleStatus.DONE
    )
    expectUserModules(['MA2001'], ['MA2219'])
  })

  it('done -> not taken -> done', async () => {
    expect.assertions(4)
    // done -> not taken
    t.user = await Repo.User!.setModuleStatus(
      t.user!,
      'MA2001',
      ModuleStatus.NOT_TAKEN
    )
    expectUserModules([], ['MA2219'])
    // not taken -> done
    t.user = await Repo.User!.setModuleStatus(
      t.user!,
      'MA2001',
      ModuleStatus.DONE
    )
    expectUserModules(['MA2001'], ['MA2219'])
  })

  it('doing -> not taken -> doing', async () => {
    expect.assertions(4)
    // doing -> not taken
    t.user = await Repo.User!.setModuleStatus(
      t.user!,
      'MA2219',
      ModuleStatus.NOT_TAKEN
    )
    expectUserModules(['MA2001'], [])
    // not taken -> doing
    t.user = await Repo.User!.setModuleStatus(
      t.user!,
      'MA2219',
      ModuleStatus.DOING
    )
    expectUserModules(['MA2001'], ['MA2219'])
  })

  it('Throws error if invalid module code is passed in', async () => {
    await expect(() =>
      Repo.User!.setModuleStatus(
        t.user!,
        init.invalidModuleCode,
        ModuleStatus.DONE
      )
    ).rejects.toThrow(Error)
  })
})
