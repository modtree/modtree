import { ColumnType } from 'typeorm'
import { createEmpty } from '.'

it('Returns 0 for number', () => {
  expect(createEmpty(Number)).toEqual(0)
})

it('Returns empty string for everything else', () => {
  const tests: ColumnType[] = [String, 'longblob', 'text', 'json', 'mediumblob']
  tests.forEach((one) => {
    expect(createEmpty(one)).toEqual('')
  })
})
