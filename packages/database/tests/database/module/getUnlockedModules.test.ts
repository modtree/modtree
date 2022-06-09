import { getSource } from '@src/data-source'
import { setup, teardown, Repo } from '@environment'
import { oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const modulesDone = ['CS1010']
const modulesDoing = []

it('Correctly gets unlocked modules', async () => {
  // Get unlocked modules for CS2100
  const codes = await Repo.Module.getUnlockedModules(
    modulesDone,
    modulesDoing,
    'CS2100'
  )
  expect(codes).toBeDefined()
  if (!codes) return
  // Notice that this does not include all CS2100 post-reqs
  const expected = ['CS2106', 'CS3210', 'CS3237']
  // Compare module codes
  expect(codes.sort()).toStrictEqual(expected.sort())
})

it('Returns empty array if module in User.modulesDone', async () => {
  // Get unlocked modules for CS1010, which is in User.modulesDone
  const modules = await Repo.Module.getUnlockedModules(
    modulesDone,
    modulesDoing,
    'CS1010'
  )
  expect(modules).toBeDefined()
  if (!modules) return
  expect(modules).toEqual([])
})
