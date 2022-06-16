import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { UserRepository } from '../src'

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

describe('User.hasTakenModule', () => {
  it('Returns true for all modulesDone and modulesDoing', async () => {
    expect.assertions(2)
    const modulesDoneCodes = init.user1.modulesDone
    const modulesDoingCodes = init.user1.modulesDoing
    const moduleCodes = modulesDoneCodes.concat(modulesDoingCodes)
    await Promise.all(
      moduleCodes.map((x) => Repo.User!.hasTakenModule(t.user!, x))
    ).then((res) => {
      res.forEach((mod) => {
        expect(mod).toEqual(true)
      })
    })
  })

  it('Returns false if module is not in modulesDone and modulesDoing', async () => {
    expect.assertions(2)
    const moduleCodes = ['CM1102', 'EL3201']
    await Promise.all(
      moduleCodes.map((x) => Repo.User!.hasTakenModule(t.user!, x))
    ).then((res) => {
      res.forEach((mod) => {
        expect(mod).toEqual(false)
      })
    })
  })

  it('Returns false for invalid module codes', async () => {
    expect.assertions(1)
    const moduleCodes = [init.invalidModuleCode]
    await Promise.all(
      moduleCodes.map((x) => Repo.User!.hasTakenModule(t.user!, x))
    ).then((res) => {
      res.forEach((mod) => {
        expect(mod).toEqual(false)
      })
    })
  })
})