import { oneUp } from '.'

test('it works', () => {
  expect(oneUp(__filename)).toStrictEqual('string_one_up_spec_ts')
})
