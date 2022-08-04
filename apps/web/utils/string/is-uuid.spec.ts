import { isUUID } from '.'

it('returns true for UUIDs', () => {
  expect(isUUID('e87d372e-d789-45b4-8dda-0a8b3ce8a8a0')).toBe(true)
})

it('returns false for non UUIDs', () => {
  expect(isUUID('test')).toBe(false)
  expect(isUUID('123')).toBe(false)
})

it('returns false for undefined', () => {
  expect(isUUID(undefined)).toBe(false)
})
