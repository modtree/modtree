import { container, getSource } from '@src/data-source'
import { User } from '@entity'
import { setup, teardown, Repo, t } from '@environment'
import { init } from '@tests/init'
import { oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(init.user1))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

describe('User.hasTakenModule', () => {
  it('Returns true for all modulesDone and modulesDoing', async () => {
    expect.assertions(2)
    await container(db, async () => {
      const modulesDoneCodes = init.user1.modulesDone
      const modulesDoingCodes = init.user1.modulesDoing
      const moduleCodes = modulesDoneCodes.concat(modulesDoingCodes)
      await Promise.all(
        moduleCodes.map((x) => Repo.User.hasTakenModule(t.user, x))
      ).then((res) => {
        res.forEach((mod) => {
          expect(mod).toEqual(true)
        })
      })
    })
  })

  it('Returns false if module is not in modulesDone and modulesDoing', async () => {
    expect.assertions(2)
    await container(db, async () => {
      const moduleCodes = ['CM1102', 'EL3201']
      await Promise.all(
        moduleCodes.map((x) => Repo.User.hasTakenModule(t.user, x))
      ).then((res) => {
        res.forEach((mod) => {
          expect(mod).toEqual(false)
        })
      })
    })
  })

  it('Returns false for invalid module codes', async () => {
    expect.assertions(1)
    await container(db, async () => {
      const moduleCodes = [init.invalidModuleCode]
      await Promise.all(
        moduleCodes.map((x) => Repo.User.hasTakenModule(t.user, x))
      ).then((res) => {
        res.forEach((mod) => {
          expect(mod).toEqual(false)
        })
      })
    })
  })
})
