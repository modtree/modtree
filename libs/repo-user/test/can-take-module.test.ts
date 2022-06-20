import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Repo.User!.initialize({
        ...init.user1,
        modulesDone: ['MA2001'],
        modulesDoing: ['MA2219'],
      })
    )
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('resolves modules not taken', async () => {
  const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
  await Promise.all(
    modulesTested.map((x) => Repo.User!.canTakeModule(t.user!, x))
  ).then((res) => {
    expect(res).toStrictEqual([true, false, false, true])
  })
})

it('errors on modules taking/taken before', async () => {
  // one done, one doing
  const modulesTested = ['MA2001', 'MA2219']
  await Promise.all(
    modulesTested.map((x) => Repo.User!.canTakeModule(t.user!, x))
  ).then((res) => {
    expect(res).toStrictEqual([false, false])
  })
})

it('errors on invalid code', async () => {
  await Repo.User!.canTakeModule(t.user!, 'NOT_VALID').then((res) => {
    expect(res).toStrictEqual(false)
  })
})
