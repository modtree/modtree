import '@modtree/test-env/jest'
import { Module } from '@modtree/types'
import { checkTree } from './check-tree'

const fakeData: Record<string, Partial<Module>> = {
  // 1000 mods
  A1000: { prereqTree: '' },
  B1000: { prereqTree: '' },
  // 2000 mods
  A2000: { prereqTree: 'A1000' },
  B2000: { prereqTree: 'A1000' },
  C2000: { prereqTree: { and: ['A1000', 'B1000'] } },
  D2000: { prereqTree: { or: ['A1000', 'B1000'] } },
}

const correct = [
  {
    type: 'module with no pre-requisites',
    query: 'A1000',
    done: [],
    expected: true,
  },
  {
    type: 'pre-reqs cleared',
    query: 'A2000',
    done: ['A1000'],
    expected: true,
  },
  {
    type: 'pre-reqs not cleared',
    query: 'A2000',
    done: ['B1000'],
    expected: false,
  },
]

test.each(correct)('$type', async ({ query, done, expected }) => {
  const tree = fakeData[query].prereqTree || ''
  expect(checkTree(tree, done)).toBe(expected)
})
