import { oneUp } from '.'

const correct: string[][] = [
  ['/path/to/parent/dir/filename.test.ts', 'dir_filename_test_ts'],
  ['/degree/:degreeId/get-full/[GET].test.ts', 'get_full__GET__test_ts'],
  ['/_/_/_/_.test.ts', '____test_ts'],
]

test.each(correct)('%s one-ups correctly', (received, expected) => {
  expect(oneUp(received)).toBe(expected)
})
