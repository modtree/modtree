import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleStatus, User } from '@modtree/types'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(init.user1.email))
    .then((user) =>
      Repo.User.setModuleStatus(user, init.user1.modulesDone, ModuleStatus.DONE)
    )
    .then((user) =>
      Repo.User.setModuleStatus(
        user,
        init.user1.modulesDoing,
        ModuleStatus.DOING
      )
    )
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

async function hasTakenModule(user: User, moduleCode: string) {
  return Repo.User.hasTakenModule(user, moduleCode)
}

it('returns true for modulesDone', async () => {
  const done = init.user1.modulesDone
  await Promise.all(done!.map((m) => hasTakenModule(t.user!, m))).then(
    (res) => {
      expect(res.every(Boolean)).toBe(true)
    }
  )
})

it('returns true for modulesDoing', async () => {
  const doing = init.user1.modulesDoing
  await Promise.all(doing!.map((m) => hasTakenModule(t.user!, m))).then(
    (res) => {
      expect(res.every(Boolean)).toBe(true)
    }
  )
})

it('returns false for others', async () => {
  const codes = ['CM1102', 'EL3201', 'NOT_VALID']
  await Promise.all(codes.map((m) => hasTakenModule(t.user!, m))).then(
    (res) => {
      expect(res.every(Boolean)).toBe(false)
    }
  )
})
