import { container, getSource } from '../../../src/data-source'
import { Module, User } from '../../../src/entity'
import { getModuleRepository, getUserRepository } from '../../../src/repository'
import Init from '../../init'
import { setup, teardown } from '../../environment'
import { oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ user: User; postReqsCodes: string[] }> = {}

beforeAll(() =>
  setup(db)
    .then(() => getUserRepository(db).initialize(Init.emptyUser))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Gets all post-reqs', async () => {
  const addModuleCodes = ['MA2001']
  // Get post reqs
  const postReqs = await container(db, () =>
    getUserRepository(db).getPostReqs(t.user, addModuleCodes)
  )
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  // Get fulfillRequirements for MA2001
  const mod = await container(db, () =>
    getModuleRepository(db).findOneBy({
      moduleCode: 'MA2001',
    })
  )
  expect(mod).toBeDefined()
  if (!mod) return
  // Compare module codes
  t.postReqsCodes = postReqs.map((one: Module) => one.moduleCode)
  expect(t.postReqsCodes.sort()).toStrictEqual(mod.fulfillRequirements.sort())
})

it('Returns empty array for modules with empty string fulfillRequirements', async () => {
  // CP2106 has empty string fulfillRequirements
  const addModuleCodes = ['CP2106']
  // Get post reqs
  const postReqs = await container(db, () =>
    getUserRepository(db).getPostReqs(t.user, addModuleCodes)
  )
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  expect(postReqs).toEqual([])
})
