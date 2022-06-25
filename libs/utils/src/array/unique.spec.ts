import { unique } from '.'
import '@modtree/test-env/jest'

it('extracts unique elements', () => {
  expect(unique([1, 2, 2])).toIncludeSameMembers([1, 2])
})

it('works on an already-unqiue array', () => {
  expect(unique([1, 2, 3])).toIncludeSameMembers([1, 2, 3])
})

it('works on an empty array', () => {
  expect(unique([])).toIncludeSameMembers([])
})

it('works on weird arrays', () => {
  expect(unique([null, undefined, null])).toIncludeSameMembers([
    null,
    undefined,
  ])
})
