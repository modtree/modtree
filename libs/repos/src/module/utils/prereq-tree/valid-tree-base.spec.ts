import { validTreeBase } from './valid-tree-base'
import '@modtree/test-env/jest'

/**
 * wrap the original function with an any
 * so we can test invalid cases
 */
const testFn = (tree: any) => validTreeBase(tree)

describe('valid', () => {
  test('empty string', () => {
    const res = testFn('')
    expect(res).toBe(true)
  })

  test('string tree', () => {
    const res = testFn('CS1010S')
    expect(res).toBe(true)
  })

  test('json tree', () => {
    const res = testFn({
      and: ['CS1010', 'CS1231'],
      or: ['MA1100'],
    })
    expect(res).toBe(true)
  })

  test('big json tree', () => {
    const res = testFn({
      and: ['CS1010', 'CS1231'],
      or: ['MA1100'],
    })
    expect(res).toBe(true)
  })
})

describe('invalid', () => {
  test('array', () => {
    const res = testFn(['CS1010S'])
    expect(res).toBe(false)
  })

  test('number', () => {
    const res = testFn(9)
    expect(res).toBe(false)
  })

  test('set', () => {
    const res = testFn(new Set())
    expect(res).toBe(false)
  })

  test('undefined', () => {
    const res = testFn(undefined)
    expect(res).toBe(false)
  })

  test('null', () => {
    const res = testFn(null)
    expect(res).toBe(false)
  })
})
