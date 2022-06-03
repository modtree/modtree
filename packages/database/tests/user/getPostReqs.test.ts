import { container, endpoint, getSource } from '../../src/data-source'
import { Module, User } from '../../src/entity'
import { ModuleRepository, UserRepository } from '../../src/repository'
import { Init } from '../../types/entity'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'
import { flatten } from '../../src'

const dbName = 'test_user_getPostReqs'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

jest.setTimeout(20000)

let user: User
let postReqsCodes: string[]

it('Saves a user', async () => {
  const props: Init.UserProps = init.emptyUser
  props.modulesDone.push('MA2001')
  props.modulesDoing.push('MA2101')
  const res = await endpoint(db, () =>
    container(db, async () => {
      await UserRepository(db).initialize(props)
      return await UserRepository(db).findOneByUsername(props.username)
    })
  )
  expect(res).toBeDefined()
  if (!res) return
  user = res
})

it('Gets all post-reqs', async () => {
  // Get post reqs
  const postReqs = await container(db, () => UserRepository(db).getPostReqs(user))
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  // Get fulfillRequirements for MA2001
  const mod = await endpoint(db, () =>
    container(db, () => ModuleRepository(db).findOneBy({
      moduleCode: 'MA2001'
    }))
  )
  expect(mod).toBeDefined()
  if (!mod) return
  // Remove modules doing
  const expected = mod.fulfillRequirements.filter((one) => one !== 'MA2101')
  // Compare module codes
  postReqsCodes = postReqs.map(flatten.module)
  expect(postReqsCodes.sort()).toEqual(expected.sort())
})
