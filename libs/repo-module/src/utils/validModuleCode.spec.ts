import { validModuleCode } from '.'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t } from '@modtree/test-env'
import { ModuleCondensedRepository } from '../ModuleCondensed'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.ModuleCondensed = new ModuleCondensedRepository(db)
  })
)
afterAll(() => teardown(db))

const lowerBound = 6000

test('validModuleCode returns true on all existing codes', async () => {
  await Repo.ModuleCondensed!.getCodes().then((moduleCodes) => {
    t.moduleCodes = moduleCodes
    expect(t.moduleCodes.length).toBeGreaterThan(lowerBound)
    t.moduleCodes.forEach((moduleCode) => {
      expect(validModuleCode(moduleCode)).toBe(true)
    })
  })
})

test('validModuleCode throws error on invalid code', async () => {
  const err = Error('Invalid module code')
  expect(() => validModuleCode('cs1010s')).toThrowError(err)
  expect(() => validModuleCode('')).toThrowError(err)
})