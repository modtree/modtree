import { hasOnly } from '.'

/**
 * only gonna be testing for query params
 */

test('valid case', () => {
  const validator = hasOnly(['yes', 'no'])
  expect(() =>
    validator('', {
      location: 'query',
      path: '/',
      req: {
        query: {
          yes: 0,
          no: 0,
        },
      },
    })
  ).not.toThrowError()
})

test('invalid case', () => {
  const validator = hasOnly(['yes', 'no'])
  expect(() =>
    validator('', {
      location: 'query',
      path: '/',
      req: {
        query: {
          yes: 0,
          no: 0,
          maybe: 'sus',
        },
      },
    })
  ).toThrowError('The only query attributes allowed are: yes, no')
})
