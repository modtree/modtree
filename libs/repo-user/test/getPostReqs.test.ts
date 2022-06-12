import { Module } from '@modtree/entity'
import { InitProps } from '@modtree/types'
import { setup, teardown, t, Repo, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { UserRepository } from '../src'
import { ModuleRepository } from '@modtree/repo-module'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const userProps: InitProps['User'] = {
  ...init.emptyUser,
  modulesDone: ['MA2001'],
  modulesDoing: ['MA2101'],
}

beforeAll(() =>
  setup(db)
    .then(() => {
      Object.assign(Repo, {
        User: new UserRepository(db),
        Module: new ModuleRepository(db),
      })
      return Repo.User!.initialize(userProps)
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Gets all post-reqs', async () => {
  // Get post reqs
  expect.assertions(3)
  await container(db, () =>
    Repo.User!.getPostReqs(t.user!)
      .then((res) => {
        expect(res).toBeInstanceOf(Array)
        t.postReqsCodes = res.map(flatten.module)
        return res
      })
      .then(() =>
        Repo.Module!.findOneByOrFail({
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
        expect(t.postReqsCodes!.sort()).toStrictEqual(expected.sort())
      })
  )
})

it('Returns empty array for modules with empty string fulfillRequirements', async () => {
  // init new user with CP2106
  // CP2106 has empty string fulfillRequirements
  const props: InitProps['User'] = init.user1
  props.modulesDone = ['CP2106']
  const res = await container(db, async () => {
    await Repo.User!.initialize(props)
    return Repo.User!.findOneByUsername(props.username)
  })
  expect(res).toBeDefined()
  if (!res) return
  // Get post reqs
  const postReqs = await container(db, () => Repo.User!.getPostReqs(res))
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  expect(postReqs).toEqual([])
})