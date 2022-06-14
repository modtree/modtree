import { setup, teardown, Repo, init } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.Module = new ModuleRepository(db)
  })
)
afterAll(() => teardown(db))

const modulesDone = ['MA2001']
const modulesDoing = ['MA2219']

it('Correctly handles fresh modules', async () => {
  expect.assertions(1)
  const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
  await Promise.all(
    modulesTested.map((x) =>
      Repo.Module!.canTakeModule(modulesDone, modulesDoing, x)
    )
  ).then((res) => {
    expect(res).toStrictEqual([true, false, false, true])
  })
})

it('Rejects modules done/doing', async () => {
  expect.assertions(1)
  // one done, one doing
  const modulesTested = ['MA2001', 'MA2219']
  await Promise.all(
    modulesTested.map((x) =>
      Repo.Module!.canTakeModule(modulesDone, modulesDoing, x)
    )
  ).then((res) => {
    expect(res).toStrictEqual([false, false])
  })
})

it('Rejects invalid module code', async () => {
  expect.assertions(1)
  await Repo.Module!.canTakeModule(
    modulesDone,
    modulesDoing,
    init.invalidModuleCode
  ).then((res) => {
    expect(res).toStrictEqual(false)
  })
})
