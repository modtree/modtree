import { container, getSource } from '../../../src/data-source'
import { Module, User } from '../../../src/entity'
import { ModuleRepository, UserRepository } from '../../../src/repository'
import type * as InitProps from '../../../types/init-props'
import Init from '../../init'
import { setup, teardown } from '../../environment'
import { Flatten, oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const t: Partial<{
  user: User
  postReqsCodes: string[]
}> = {}

it('Saves a user', async () => {
  expect.assertions(1)
  const props = Init.emptyUser
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
        t.postReqsCodes = res.map(Flatten.module)
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

it('Returns empty array for modules with empty string fulfillRequirements', async () => {
  // init new user with CP2106
  // CP2106 has empty string fulfillRequirements
  const props: InitProps.User = Init.user1
  props.modulesDone = ['CP2106']
  const res = await container(db, async () => {
    await UserRepository(db).initialize(props)
    return UserRepository(db).findOneByUsername(props.username)
  })
  expect(res).toBeDefined()
  if (!res) return
  // Get post reqs
  const postReqs = await container(db, () =>
    UserRepository(db).getPostReqs(res)
  )
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  expect(postReqs).toEqual([])
})
