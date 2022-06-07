import { container, getSource } from '../../../src/data-source'
import { InitProps } from '../../../types/init-props'
import Init from '../../init'
import { setup, teardown, Repo, t } from '../../environment'
import { oneUp } from '../../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

const userProps: InitProps['User'] = {
  ...Init.emptyUser,
  modulesDone: ['MA2001'],
  modulesDoing: ['MA2219'],
}

beforeAll(() =>
  setup(db)
    .then(() => Repo.User.initialize(userProps))
    .then((user) => {
      t.user = user
    })
)
afterAll(() => teardown(db))

it('Correctly handles modules not taken before', async () => {
  expect.assertions(1)
  await container(db, async () => {
    const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
    await Promise.all(
      modulesTested.map((x) => Repo.User.canTakeModule(t.user, x))
    ).then((res) => {
      expect(res).toStrictEqual([true, false, false, true])
    })
  })
})

it('Returns false for modules taken before/currently', async () => {
  expect.assertions(1)
  await container(db, async () => {
    // one done, one doing
    const modulesTested = ['MA2001', 'MA2219']
    await Promise.all(
      modulesTested.map((x) => Repo.User.canTakeModule(t.user, x))
    ).then((res) => {
      expect(res).toStrictEqual([false, false])
    })
  })
})

it('Returns false if module code passed in does not exist', async () => {
  expect.assertions(1)
  await container(db, () =>
    Repo.User.canTakeModule(t.user, Init.invalidModuleCode).then((res) => {
      expect(res).toStrictEqual(false)
    })
  )
})
