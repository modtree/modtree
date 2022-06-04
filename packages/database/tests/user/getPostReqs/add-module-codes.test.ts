import { container, endpoint, getSource } from '../../../src/data-source'
import { Module, User } from '../../../src/entity'
import { ModuleRepository, UserRepository } from '../../../src/repository'
import { Init } from '../../../types/entity'
import { init } from '../../init'
import { setup, importChecks, teardown } from '../../environment'

const dbName = 'test_user_getPostReqs_add_module_codes'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, User],
  repositories: [ModuleRepository(db), UserRepository(db)],
})

let user: User
let postReqsCodes: string[]

it('Saves an empty user', async () => {
  const props: Init.UserProps = init.emptyUser
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
  const addModuleCodes = ['MA2001']
  // Get post reqs
  const postReqs = await container(db, () => UserRepository(db).getPostReqs(user, addModuleCodes))
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
  // Compare module codes
  postReqsCodes = postReqs.map((one: Module) => one.moduleCode)
  expect(postReqsCodes.sort()).toEqual(mod.fulfillRequirements.sort())
})

it('Returns empty array for modules with empty string fulfillRequirements', async () => {
  // CP2106 has empty string fulfillRequirements
  const addModuleCodes = ['CP2106']
  // Get post reqs
  const postReqs = await endpoint(db, () =>
    container(db, () => UserRepository(db).getPostReqs(user, addModuleCodes))
  )
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  expect(postReqs).toEqual([])
})
