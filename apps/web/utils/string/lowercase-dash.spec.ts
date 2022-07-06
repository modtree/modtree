import { lowercaseAndDash } from '.'

it('turns uppercase to lowercase', () => {
  expect(lowercaseAndDash('TEST')).toEqual('test')
})

it('replaces contiguous spaces with a single dash', () => {
  expect(lowercaseAndDash('a    long   string')).toEqual('a-long-string')
})
