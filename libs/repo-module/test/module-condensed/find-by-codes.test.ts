import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { init, Repo, setup, teardown } from '@modtree/test-env'
import { ModuleCondensedRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.ModuleCondensed = new ModuleCondensedRepository(db)
  })
)
afterAll(() => teardown(db))

describe('ModuleCondensed.findByCodes', () => {
  it('Returns the same modules', async () => {
    const moduleCodes = ['MA2001', 'CS1231S', 'EL1101E']
    await Repo.ModuleCondensed!.findByCodes(moduleCodes).then((modules) => {
      expect(modules).toBeDefined()
      if (!modules) return
      const mappedModuleCodes = modules.map((one) => one.moduleCode)
      expect(moduleCodes.sort()).toStrictEqual(mappedModuleCodes.sort())
    })
  })

  it('Skips invalid module codes', async () => {
    const moduleCodes = ['MA2001', init.invalidModuleCode]
    const expectedCodes = ['MA2001']
    await Repo.ModuleCondensed!.findByCodes(moduleCodes).then((modules) => {
      expect(modules).toBeDefined()
      if (!modules) return
      const mappedModuleCodes = modules.map((one) => one.moduleCode)
      expect(expectedCodes.sort()).toStrictEqual(mappedModuleCodes.sort())
    })
  })
})
