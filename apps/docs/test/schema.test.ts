import { generateSchema } from '../utils'
import { response, expected } from './init'
import '@modtree/test-env/jest'

const tests = Object.keys(response)

/**
 * validates the sample input and output provided in init.ts
 */
it('checks that every sample input has a corresponding output', () => {
  expect(response).toHaveSameKeysAs(expected)
})

it('generates correct keys', () => {
  tests.forEach((key) => {
    const expected = response[key]
    const generated = generateSchema(expected)
    expect(expected).toHaveSameKeysAs(generated)
  })
})

/**
 * check equal objects
 */
const results = tests.map((dataType) => [
  dataType,
  expected[dataType],
  generateSchema(response[dataType]),
])

describe('generates correct schema', () => {
  it.each(results)('for %s', (_dataType, expected, generated) => {
    expect(expected).toStrictEqual(generated)
  })
})
