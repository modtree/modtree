import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo } from '@modtree/test-env'
import { checkTree } from '.'
import { ModuleRepository } from '../Module'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.Module = new ModuleRepository(db)
  })
)
afterAll(() => teardown(db))

it('Returns true for mods without pre-reqs', async () => {
  const moduleCodes = ['CS1010', 'MA1301', 'EL1101E']
  const modules = await Repo.Module.findByCodes(moduleCodes)
  modules.forEach((one) => {
    const res = checkTree(one.prereqTree, [])
    expect(res).toEqual(true)
  })
})

it('Returns true if necessary pre-reqs for a mod are cleared', async () => {
  const module = await Repo.Module.findOneByOrFail({
    moduleCode: 'CS2040S',
  })
  const modulesDone = ['CS1231', 'CS1010']
  const res = checkTree(module.prereqTree, modulesDone)
  expect(res).toEqual(true)
})

it('Returns false if necessary pre-reqs for a mod are not cleared', async () => {
  const module = await Repo.Module.findOneByOrFail({
    moduleCode: 'CS2040S',
  })
  const modulesDone = []
  const res = checkTree(module.prereqTree, modulesDone)
  expect(res).toEqual(false)
})
