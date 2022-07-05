import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleStatus, User } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Repo.User.initialize({
        ...init.user1,
        modulesDone: ['MA2001'],
        modulesDoing: ['MA2219'],
      })
    )
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
 * Tests setModuleStatus with 1 module.
 * The original repo function works with many modules.
 */
async function setModuleStatus(
  user: User,
  moduleCode: string,
  status: ModuleStatus
) {
  return Repo.User.setModuleStatus(user, [moduleCode], status)
}

it('doing', async () => {
  t.user = await setModuleStatus(t.user!, 'MA2001', ModuleStatus.DOING)
  expectUserModules([], ['MA2001'])
})

it('done', async () => {
  t.user = await setModuleStatus(t.user!, 'MA2001', ModuleStatus.DONE)
  expectUserModules(['MA2001'], [])
})

it('not taken', async () => {
  t.user = await setModuleStatus(t.user!, 'MA2001', ModuleStatus.NOT_TAKEN)
  expectUserModules([], [])
})

it('errors on invalid module code', async () => {
  await expect(() =>
    setModuleStatus(t.user!, 'NOT_VALID', ModuleStatus.DONE)
  ).rejects.toThrow(Error)
})
