import { validModuleCode } from '.'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo } from '@modtree/test-env'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

test('returns true on all existing codes', async () => {
  await Repo.ModuleCondensed!.getCodes().then((moduleCodes) => {
    moduleCodes.forEach((moduleCode) => {
      expect(validModuleCode(moduleCode)).toBe(true)
    })
  })
})

const err = Error('Invalid module code')

test('error on cs1010s', () => {
  expect(() => validModuleCode('cs1010s')).toThrowError(err)
})

test('error on blank', () => {
  expect(() => validModuleCode('')).toThrowError(err)
})

test('error on NOT_VALID', () => {
  expect(() => validModuleCode('NOT_VALID')).toThrowError(err)
})
