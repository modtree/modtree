import { getNestedCodes } from './get-nested-codes'
import '@modtree/test-env/jest'

/**
 * wrap the original function with an any
 * so we can test invalid cases
 */
const testFn = (tree: any) => getNestedCodes(tree)

describe('valid', () => {
  test('empty string', () => {
    const res = testFn('')
    expect(res.valid).toBe(true)
    expect(res.codes).toIncludeSameMembers([])
  })

  test('string tree', () => {
    const res = testFn('CS1010S')
    expect(res.valid).toBe(true)
    expect(res.codes).toIncludeSameMembers(['CS1010S'])
  })

  test('json tree', () => {
    const res = testFn({
      and: ['CS1010', 'CS1231'],
      or: ['MA1100'],
    })
    expect(res.valid).toBe(true)
    expect(res.codes).toIncludeSameMembers(['CS1010', 'CS1231', 'MA1100'])
  })

  test('big json tree', () => {
    const res = testFn({
      and: [
        {
          or: ['MA2001', 'MA2002'],
        },
        {
          or: ['CS2030', 'CS2040'],
        },
        'CS1231',
      ],
      or: ['MA1100', { and: ['CM1102', 'PC1431'] }],
    })
    expect(res.valid).toBe(true)
    expect(res.codes).toIncludeSameMembers([
      'MA2001',
      'MA2002',
      'CS1231',
      'MA1100',
      'CS2030',
      'CS2040',
      'CM1102',
      'PC1431',
    ])
  })
})

describe('invalid', () => {
  test('array tree', () => {
    const res = testFn(['CS1010S'])
    expect(res.valid).toBe(false)
    expect(res.codes).toEqual([])
  })
  test('number', () => {
    const res = testFn(9)
    expect(res.valid).toBe(false)
    expect(res.codes).toEqual([])
  })
  test('set', () => {
    const res = testFn(new Set())
    expect(res.valid).toBe(false)
    expect(res.codes).toEqual([])
  })
  test('undefined', () => {
    const res = testFn(undefined)
    expect(res.valid).toBe(false)
    expect(res.codes).toEqual([])
  })
  test('null', () => {
    const res = testFn(null)
    expect(res.valid).toBe(false)
    expect(res.codes).toEqual([])
  })
})
