import { quickpop } from '../../src/utils'

describe('Array.quickpop', () => {
  it('Removes an element in an unordered array', () => {
    const arr = [3, 8, 7, 4, 9]
    quickpop(arr, 2)
    const finalArr = [3, 8, 4, 9]
    expect(arr.sort()).toEqual(finalArr.sort())
    expect(arr.length).toEqual(finalArr.length)
  })

  it('Removes the first element in an unordered array', () => {
    const arr = [3, 8, 7, 4, 9]
    quickpop(arr, 0)
    const finalArr = [8, 7, 4, 9]
    expect(arr.sort()).toEqual(finalArr.sort())
    expect(arr.length).toEqual(finalArr.length)
  })

  it('Removes the last element in an unordered array', () => {
    const arr = [3, 8, 7, 4, 9]
    quickpop(arr, 4)
    const finalArr = [3, 8, 7, 4]
    expect(arr).toEqual(finalArr)
    expect(arr.length).toEqual(finalArr.length)
  })

  it ('Throws error when running on an empty array', () => {
    let error
    const arr = []
    try {
      quickpop(arr, 0)
    } catch (err) {
      error = err
    }
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toEqual('Tried to quickpop an empty array')
  })

  it ('Throws error when index out of bounds', () => {
    let error
    const arr = [1]
    try {
      quickpop(arr, 6)
    } catch (err) {
      error = err
    }
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toEqual('Out of bounds')

    let error2
    try {
      quickpop(arr, -10)
    } catch (err) {
      error2 = err
    }
    expect(error2).toBeInstanceOf(Error)
    expect(error2.message).toEqual('Out of bounds')
  })

  it ('Throws error when running on an array of undefined', () => {
    let error
    const arr = [undefined, undefined]
    try {
      quickpop(arr, 0)
    } catch (err) {
      error = err
    }
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toEqual('Quickpop somehow popped an undefined element')
  })
})
