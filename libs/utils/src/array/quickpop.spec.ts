import { quickpop } from '.'

it('removes correct element', () => {
  const arr = [3, 8, 7, 4, 9]
  quickpop(arr, 2)
  expect(arr).toStrictEqual([3, 8, 9, 4])
})

it('removes the first element', () => {
  const arr = [3, 8, 7, 4, 9]
  quickpop(arr, 0)
  expect(arr).toStrictEqual([9, 8, 7, 4])
})

it('removes the last element', () => {
  const arr = [3, 8, 7, 1, 9]
  quickpop(arr, 4)
  expect(arr).toStrictEqual([3, 8, 7, 1])
})

it('error on empty array', () => {
  expect(() => quickpop([], 0)).toThrow(
    Error('Tried to quickpop an empty array')
  )
})

it('error on index out of bounds', () => {
  const arr = [1]
  expect(() => quickpop(arr, 6)).toThrow(Error('Out of bounds'))
  expect(() => quickpop(arr, -10)).toThrow(Error('Out of bounds'))
})

it('error on array of undefined', () => {
  const arr = [undefined, undefined]
  expect(() => quickpop(arr, 0)).toThrow(
    Error('Quickpop somehow popped an undefined element')
  )
})
