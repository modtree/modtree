import { container, getSource } from '@src/data-source'
import { init } from '@tests/init'
import { setup, teardown, Repo, t } from '@environment'
import { flatten, oneUp } from '@utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => Repo.Degree.initialize(init.degree1))
    .then((degree) => {
      t.degree = degree
      t.combinedModuleCodes = degree.modules.map(flatten.module)
    })
)
afterAll(() => teardown(db))

describe('Degree.insertModules', () => {
  it('Correctly saves newly inserted modules', async () => {
    const newModuleCodes = ['MA1521', 'MA2001', 'ST2334']
    t.combinedModuleCodes.push(...newModuleCodes)
    await container(db, () =>
      Repo.Degree.insertModules(t.degree, newModuleCodes)
    )
    // match retrieved module codes to
    // init props' module codes + added module codes
    const moduleCodes = t.degree.modules.map(flatten.module)
    expect(moduleCodes.sort()).toStrictEqual(t.combinedModuleCodes.sort())
  })
})

describe('Degree.insertModules with invalid module code', () => {
  it('Does not add new modules if all module codes are invalid', async () => {
    const newModuleCodes = [init.invalidModuleCode]
    await container(db, () =>
      Repo.Degree.insertModules(t.degree, newModuleCodes)
    )
    // match retrieved module codes to
    // init props' module codes + added module codes
    const moduleCodes = t.degree.modules.map(flatten.module)
    expect(moduleCodes.sort()).toStrictEqual(t.combinedModuleCodes.sort())
  })
  it('Adds some new modules if there is a mix of valid and invalid module codes', async () => {
    const newModuleCodes = [init.invalidModuleCode, 'CS4269']
    await container(db, () =>
      Repo.Degree.insertModules(t.degree, newModuleCodes)
    )
    // add CS4269 to the module codes
    t.combinedModuleCodes.push('CS4269')
    // match retrieved module codes to
    // init props' module codes + added module codes
    const moduleCodes = t.degree.modules.map(flatten.module)
    expect(moduleCodes.sort()).toStrictEqual(t.combinedModuleCodes.sort())
  })
})