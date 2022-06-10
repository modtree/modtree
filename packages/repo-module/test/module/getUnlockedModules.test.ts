import { setup, teardown, Repo } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db).then(() => {
  Repo.Module = new ModuleRepository(db)
}))
afterAll(() => teardown(db))

const modulesDone = ['CS1010']
const modulesDoing: string[] = []

it('Correctly gets unlocked modules', async () => {
  // Get unlocked modules for CS2100
  const codes = await Repo.Module!.getUnlockedModules(
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
  const modules = await Repo.Module!.getUnlockedModules(
    modulesDone,
    modulesDoing,
    'CS1010'
  )
  expect(modules).toBeDefined()
  if (!modules) return
  expect(modules).toEqual([])
})
