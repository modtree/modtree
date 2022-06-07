import { container, getSource } from '../../../src/data-source'
import { init } from '../../init'
import { setup, teardown, Repo, t } from '../../environment'
import { flatten, oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(init.emptyUser))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Gets all post-reqs', async () => {
  const addModuleCodes = ['MA2001']
  // Get post reqs
  const postReqs = await container(db, () =>
    Repo.User.getPostReqs(t.user, addModuleCodes)
  )
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  // Get fulfillRequirements for MA2001
  const mod = await container(db, () =>
    Repo.Module.findOneBy({
      moduleCode: 'MA2001',
    })
  )
  expect(mod).toBeDefined()
  if (!mod) return
  // Compare module codes
  t.postReqsCodes = postReqs.map(flatten.module)
  expect(t.postReqsCodes.sort()).toStrictEqual(mod.fulfillRequirements.sort())
})

it('Returns empty array for modules with empty string fulfillRequirements', async () => {
  // CP2106 has empty string fulfillRequirements
  const addModuleCodes = ['CP2106']
  // Get post reqs
  const postReqs = await container(db, () =>
    Repo.User.getPostReqs(t.user, addModuleCodes)
  )
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  expect(postReqs).toEqual([])
})
