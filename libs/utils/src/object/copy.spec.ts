import { copy } from '.'

it('copies to an empty target', () => {
  const source = {
    what: 'is up',
    its: 'been a while',
  }
  const target = {}
  copy(source, target)
  expect(target).toStrictEqual({
    what: 'is up',
    its: 'been a while',
  })
})

it('copies to a populated target', () => {
  const source = {
    what: 'is up',
    its: 'been a while',
  }
  const target = {
    long: 'time no see',
  }
  copy(source, target)
  expect(target).toStrictEqual({
    what: 'is up',
    its: 'been a while',
    long: 'time no see',
  })
})

it('does nothing with an empty source', () => {
  const source = {}
  const target = {
    long: 'time no see',
  }
  copy(source, target)
  expect(target).toStrictEqual({
    long: 'time no see',
  })
})
