import { validModuleCode } from '.'
import allCodes from './module-codes.json'

test('returns true on all existing codes', async () => {
  allCodes.forEach((code) => {
    expect(validModuleCode(code)).toBe(true)
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
