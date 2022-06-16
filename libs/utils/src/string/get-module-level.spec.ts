import { getModuleLevel } from '.'

it('correctly handles MA2001', () => {
  expect(getModuleLevel('MA2001')).toEqual(2001)
})

it('correctly handles CS2040S', () => {
  expect(getModuleLevel('CS2040S')).toEqual(2040)
})

it('correctly handles DAO1704X', () => {
  expect(getModuleLevel('DAO1704X')).toEqual(1704)
})

it('correctly handles DMX1501CT', () => {
  expect(getModuleLevel('DMX1501CT')).toEqual(1501)
})
