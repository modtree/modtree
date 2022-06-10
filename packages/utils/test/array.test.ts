import { quickpop } from '@modtree/utils'

describe('Array.quickpop', () => {
  it('Removes an element in an unordered array', () => {
    const arr = [3, 8, 7, 4, 9]
    quickpop(arr, 2)
    expect(arr).toStrictEqual([3, 8, 9, 4])
  })

  it('Removes the first element in an unordered array', () => {
    const arr = [3, 8, 7, 4, 9]
    quickpop(arr, 0)
    expect(arr).toStrictEqual([9, 8, 7, 4])
  })

  it('Removes the last element in an unordered array', () => {
    const arr = [3, 8, 7, 1, 9]
    quickpop(arr, 4)
    expect(arr).toStrictEqual([3, 8, 7, 1])
  })

  it('Throws error when running on an empty array', () => {
    expect(() => quickpop([], 0)).toThrow(
      Error('Tried to quickpop an empty array')
    )
  })

  it('Throws error when index out of bounds', () => {
    const arr = [1]
    expect(() => quickpop(arr, 6)).toThrow(Error('Out of bounds'))
    expect(() => quickpop(arr, -10)).toThrow(Error('Out of bounds'))
  })

  it('Throws error when running on an array of undefined', () => {
    const arr = [undefined, undefined]
    expect(() => quickpop(arr, 0)).toThrow(
      Error('Quickpop somehow popped an undefined element')
    )
  })
})
