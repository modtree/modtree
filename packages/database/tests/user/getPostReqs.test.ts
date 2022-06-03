import { container, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { ModuleRepository, UserRepository } from '../../src/repository'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'
import { flatten, oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => db.destroy().then(() => teardown(dbName)))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

const t: Partial<{
  user: User
  postReqsCodes: string[]
}> = {}

it('Saves a user', async () => {
  expect.assertions(1)
  const props = init.emptyUser
  props.modulesDone.push('MA2001')
  props.modulesDoing.push('MA2101')
  await container(db, () =>
    UserRepository(db)
      .initialize(props)
      .then((res) => {
        expect(res).toBeInstanceOf(User)
        t.user = res
      })
  )
})

it('Gets all post-reqs', async () => {
  // Get post reqs
  expect.assertions(3)
  await container(db, () =>
    UserRepository(db)
      .getPostReqs(t.user)
      .then((res) => {
        expect(res).toBeInstanceOf(Array)
        t.postReqsCodes = res.map(flatten.module)
        return res
      })
      .then(() =>
        ModuleRepository(db).findOneBy({
          moduleCode: 'MA2001',
        })
      )
      .then((mod) => {
        expect(mod).toBeInstanceOf(Module)
        // Remove modules doing
        const expected = mod.fulfillRequirements.filter(
          (one) => one !== 'MA2101'
        )
        // Compare module codes
        expect(t.postReqsCodes.sort()).toEqual(expected.sort())
      })
  )
})
