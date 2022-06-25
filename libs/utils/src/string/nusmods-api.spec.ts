import { nusmodsApi } from '.'

test('it works', () => {
  expect(nusmodsApi('yes')).toStrictEqual(
    'https://api.nusmods.com/v2/2021-2022/yes.json'
  )
})
