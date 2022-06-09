import { container, getSource } from '@src/data-source'
import { init } from '@tests/init'
import { setup, teardown, Repo, t } from '@environment'
import { oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const modulesDone = ['MA2001']
const modulesDoing = ['MA2219']

it('Correctly handles modules not taken before', async () => {
  expect.assertions(1)
  await container(db, async () => {
    const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
    await Promise.all(
      modulesTested.map((x) => Repo.Module.canTakeModule(modulesDone, modulesDoing, x))
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
      modulesTested.map((x) => Repo.Module.canTakeModule(modulesDone, modulesDoing, x))
    ).then((res) => {
      expect(res).toStrictEqual([false, false])
    })
  })
})

it('Returns false if module code passed in does not exist', async () => {
  expect.assertions(1)
  await container(db, () =>
    Repo.Module.canTakeModule(modulesDone, modulesDoing, init.invalidModuleCode).then((res) => {
      expect(res).toStrictEqual(false)
    })
  )
})
