import { container, getSource } from '../../../src/data-source'
import { Module, User } from '../../../src/entity'
import { getModuleRepository, getUserRepository } from '../../../src/repository'
import { InitProps } from '../../../types/init-props'
import Init from '../../init'
import { setup, teardown } from '../../environment'
import { Flatten, oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const t: Partial<{
  user: User
  postReqsCodes: string[]
}> = {}

const userProps: InitProps['User'] = {
  ...Init.emptyUser,
  modulesDone: ['MA2001'],
  modulesDoing: ['MA2101'],
}

beforeAll(() =>
  setup(db)
    .then(() => getUserRepository(db).initialize(userProps))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Gets all post-reqs', async () => {
  // Get post reqs
  expect.assertions(3)
  await container(db, () =>
    getUserRepository(db)
      .getPostReqs(t.user)
      .then((res) => {
        expect(res).toBeInstanceOf(Array)
        t.postReqsCodes = res.map(Flatten.module)
        return res
      })
      .then(() =>
        getModuleRepository(db).findOneBy({
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
        expect(t.postReqsCodes.sort()).toStrictEqual(expected.sort())
      })
  )
})

it('Returns empty array for modules with empty string fulfillRequirements', async () => {
  // init new user with CP2106
  // CP2106 has empty string fulfillRequirements
  const props: InitProps['User'] = Init.user1
  props.modulesDone = ['CP2106']
  const res = await container(db, async () => {
    await getUserRepository(db).initialize(props)
    return getUserRepository(db).findOneByUsername(props.username)
  })
  expect(res).toBeDefined()
  if (!res) return
  // Get post reqs
  const postReqs = await container(db, () =>
    getUserRepository(db).getPostReqs(res)
  )
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  expect(postReqs).toEqual([])
})
