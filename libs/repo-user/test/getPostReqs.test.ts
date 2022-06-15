import { Module } from '@modtree/entity'
import { ModuleRepository } from '@modtree/repo-module'
import { init, Repo, setup, t, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { InitProps } from '@modtree/types'
import { flatten, oneUp } from '@modtree/utils'

import { UserRepository } from '../src'

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
  await Repo.User!.getPostReqs(t.user!)
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
      const expected = mod.fulfillRequirements.filter((one) => one !== 'MA2101')
      // Compare module codes
      expect(t.postReqsCodes!.sort()).toStrictEqual(expected.sort())
    })
})

it('Returns empty array for modules with empty string fulfillRequirements', async () => {
  // init new user with CP2106
  // CP2106 has empty string fulfillRequirements
  expect.hasAssertions()
  const props: InitProps['User'] = init.user1
  props.modulesDone = ['CP2106']
  await Repo.User!.initialize(props)
    .then(() => Repo.User!.findOneByUsername(props.username))
    .then((res) => Repo.User!.getPostReqs(res))
    .then((postReqs) => {
      expect(postReqs).toBeDefined()
      expect(postReqs).toEqual([])
    })
})
