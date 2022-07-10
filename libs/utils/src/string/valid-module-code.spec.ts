import { validModuleCode } from '.'
import allCodes from './module-codes.json'

test('returns true on all existing codes', async () => {
  allCodes.forEach((code) => {
    expect(validModuleCode(code)).toBe(true)
  })
})

test('false on cs1010s', () => {
  expect(validModuleCode('cs1010s')).toBe(false)
})

test('false on blank', () => {
  expect(validModuleCode('')).toBe(false)
})

test('false on NOT_VALID', () => {
  expect(validModuleCode('NOT_VALID')).toBe(false)
})
