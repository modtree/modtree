import { getModuleLevel } from '../../src'

it('correctly extracts the 4-digit code', () => {
  const input = ['MA2001', 'CS2040S', 'DAO1704X', 'DMX1501CT']
  const output = [2001, 2040, 1704, 1501]
  const mapped = input.map((moduleCode) => getModuleLevel(moduleCode))
  expect(mapped).toStrictEqual(output)
})
