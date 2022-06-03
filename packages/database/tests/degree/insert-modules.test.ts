import { container, getSource } from '../../src/data-source'
import { Degree} from '../../src/entity'
import { DegreeRepository } from '../../src/repository'
import { init } from '../init'
import { setup } from '../environment'
import { flatten } from '../../src/utils'
import { setupDegree } from './setup'

const dbName = 'test_degree'
const db = getSource(dbName)
const t: Partial<{ degree: Degree; combinedModuleCodes: string[] }> = {}

beforeAll(() =>
  setup(dbName)
    .then(() => setupDegree(db))
    .then((degree) => {
      t.degree = degree
      t.combinedModuleCodes = degree.modules.map(flatten.module)
    })
    .catch(() => {
      throw new Error('Unable to setup Degree test.')
    })
)
afterAll(() => db.dropDatabase().then(() => db.destroy()))

describe('Degree.insertModules', () => {
  it('Adds modules to a degree', async () => {
    const newModuleCodes = ['MA1521', 'MA2001', 'ST2334']
    t.combinedModuleCodes.push(...newModuleCodes)
    await container(db, () =>
      DegreeRepository(db).insertModules(t.degree, newModuleCodes)
    )
  })

  it('Correctly saves newly inserted modules', async () => {
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
      DegreeRepository(db).insertModules(t.degree, newModuleCodes)
    )
    // match retrieved module codes to
    // init props' module codes + added module codes
    const moduleCodes = t.degree.modules.map(flatten.module)
    expect(moduleCodes.sort()).toStrictEqual(t.combinedModuleCodes.sort())
  })
  it('Adds some new modules if there is a mix of valid and invalid module codes', async () => {
    const newModuleCodes = [init.invalidModuleCode, 'CS4269']
    await container(db, () =>
      DegreeRepository(db).insertModules(t.degree, newModuleCodes)
    )
    // add CS4269 to the module codes
    t.combinedModuleCodes.push('CS4269')
    // match retrieved module codes to
    // init props' module codes + added module codes
    const moduleCodes = t.degree.modules.map(flatten.module)
    expect(moduleCodes.sort()).toStrictEqual(t.combinedModuleCodes.sort())
  })
})
