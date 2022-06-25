import { hasOneOf } from '.'

/**
 * only gonna be testing for query params
 */

test('valid case', () => {
  const validator = hasOneOf(['yes', 'no'])
  expect(() =>
    validator('', {
      location: 'query',
      path: '/',
      req: {
        query: {
          yes: 0,
          maybe: 0,
        },
      },
    })
  ).not.toThrowError()
})

test('invalid case', () => {
  const validator = hasOneOf(['yes', 'no'])
  expect(() =>
    validator('', {
      location: 'query',
      path: '/',
      req: {
        query: {
          maybe: 'sus',
        },
      },
    })
  ).toThrowError('Please specify at least of one of: yes, no.')
})
