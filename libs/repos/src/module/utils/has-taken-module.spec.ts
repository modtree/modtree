import { hasTakenModule } from '.'

it('true if already done', () => {
  expect(hasTakenModule(['CS1010'], ['MA2001'], 'CS1010')).toEqual(true)
})

it('true if currently doing', () => {
  expect(hasTakenModule(['CS1010'], ['MA2001'], 'MA2001')).toEqual(true)
})

it('false otherwise', () => {
  expect(hasTakenModule(['CS1010'], ['MA2001'], 'PC1201')).toEqual(false)
})
