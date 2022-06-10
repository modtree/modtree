import { setup, teardown, Repo } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { getModuleRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.Module = getModuleRepository(db)
  })
)
afterAll(() => teardown(db))

it('Adds only modules which have pre-reqs cleared', async () => {
  const modulesDone = ['CS1101S']
  const modulesDoing = []
  const modulesSelected = []
  expect.assertions(2)
  await Repo.Module.getEligibleModules(
    modulesDone,
    modulesDoing,
    modulesSelected
  ).then((eligibleModuleCodes) => {
    expect(eligibleModuleCodes).toBeInstanceOf(Array)
    const expected = ['CS2109S']
    /**
     * Compare module codes
     */
    expect(eligibleModuleCodes.sort()).toStrictEqual(expected.sort())
  })
})

it('modulesDone and modulesSelected function the same way', async () => {
  const modulesDone = []
  const modulesDoing = []
  const modulesSelected = ['CS1101S']
  expect.assertions(2)
  await Repo.Module.getEligibleModules(
    modulesDone,
    modulesDoing,
    modulesSelected
  ).then((eligibleModuleCodes) => {
    expect(eligibleModuleCodes).toBeInstanceOf(Array)
    const expected = ['CS2109S']
    /**
     * Compare module codes
     */
    expect(eligibleModuleCodes.sort()).toStrictEqual(expected.sort())
  })
})
