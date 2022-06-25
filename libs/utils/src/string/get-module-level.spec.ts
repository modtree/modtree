import { getModuleLevel } from '.'

const testFn = (value: any) => getModuleLevel(value)

it('correctly handles MA2001', () => {
  expect(testFn('MA2001')).toEqual(2001)
})

it('correctly handles CS2040S', () => {
  expect(testFn('CS2040S')).toEqual(2040)
})

it('correctly handles DAO1704X', () => {
  expect(testFn('DAO1704X')).toEqual(1704)
})

it('correctly handles DMX1501CT', () => {
  expect(testFn('DMX1501CT')).toEqual(1501)
})

it('correctly handles undefined', () => {
  expect(testFn(undefined)).toEqual(0)
})
