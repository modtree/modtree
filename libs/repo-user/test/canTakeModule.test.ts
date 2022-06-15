import { InitProps } from '@modtree/types'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { UserRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const userProps: InitProps['User'] = {
  ...init.user1,
  modulesDone: ['MA2001'],
  modulesDoing: ['MA2219'],
}

beforeAll(() =>
  setup(db)
    .then(() => {
      Repo.User = new UserRepository(db)
      return Repo.User!.initialize(userProps)
    })
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))
beforeEach(() => expect.assertions(1))

it('modules not taken before -> maybe', async () => {
  const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
  await Promise.all(
    modulesTested.map((x) => Repo.User!.canTakeModule(t.user!, x))
  ).then((res) => {
    expect(res).toStrictEqual([true, false, false, true])
  })
})

it('modules taken before/currently -> false', async () => {
  // one done, one doing
  const modulesTested = ['MA2001', 'MA2219']
  await Promise.all(
    modulesTested.map((x) => Repo.User!.canTakeModule(t.user!, x))
  ).then((res) => {
    expect(res).toStrictEqual([false, false])
  })
})

it('invalid code', async () => {
  await Repo.User!.canTakeModule(t.user!, 'NOT_VALID').then((res) => {
    expect(res).toStrictEqual(false)
  })
})
