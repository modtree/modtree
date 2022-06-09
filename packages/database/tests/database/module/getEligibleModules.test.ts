import { getSource } from '@src/data-source'
import { setup, teardown, Repo } from '@environment'
import { oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
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
