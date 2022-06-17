import { generateSchema } from '../utils'
import { response, expected } from './init'

/**
 * Checks that two dictionaries have the same keys
 *
 * @param {Record<string, any>} a
 * @param {Record<string, any>} b
 */
function equalKeys(a: Record<string, any>, b: Record<string, any>) {
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  expect(aKeys).toStrictEqual(bKeys)
}

const tests = Object.keys(response)

describe('general checks', () => {
  /**
   * validates the sample input and output provided in init.ts
   */
  it('every input has a corresponding expected output', () => {
    equalKeys(response, expected)
  })

  it('same keys in response and generated schema', () => {
    tests.forEach((key) => {
      const input = response[key]
      const output = generateSchema(input)
      equalKeys(input, output)
    })
  })
})

/**
 * check equal objects
 */
describe('generated schema is same as expected', () => {
  const results = tests.map((one) => [
    one,
    expected[one],
    generateSchema(response[one]),
  ])

  it.each(results)('for %s', (dataType, expected, generated) => {
    expect(expected).toStrictEqual(generated)
  })
})
