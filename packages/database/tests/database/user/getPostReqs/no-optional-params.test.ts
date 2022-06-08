import { container, getSource } from '@src/data-source'
import { Module } from '@entity'
import { InitProps } from '@mtypes/init-props'
import { init } from '@tests/init'
import { setup, teardown, t, Repo } from '@environment'
import { flatten, oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const userProps: InitProps['User'] = {
  ...init.emptyUser,
  modulesDone: ['MA2001'],
  modulesDoing: ['MA2101'],
}

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(userProps))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Gets all post-reqs', async () => {
  // Get post reqs
  expect.assertions(3)
  await container(db, () =>
    Repo.User.getPostReqs(t.user)
      .then((res) => {
        expect(res).toBeInstanceOf(Array)
        t.postReqsCodes = res.map(flatten.module)
        return res
      })
      .then(() =>
        Repo.Module.findOneBy({
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
  const props: InitProps['User'] = init.user1
  props.modulesDone = ['CP2106']
  const res = await container(db, async () => {
    await Repo.User.initialize(props)
    return Repo.User.findOneByUsername(props.username)
  })
  expect(res).toBeDefined()
  if (!res) return
  // Get post reqs
  const postReqs = await container(db, () => Repo.User.getPostReqs(res))
  expect(postReqs).toBeDefined()
  if (!postReqs) return
  expect(postReqs).toEqual([])
})
