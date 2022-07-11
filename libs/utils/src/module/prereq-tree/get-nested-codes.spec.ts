import { getNestedCodes, validTreeBase } from './get-nested-codes'
import '@modtree/test-env/jest'

const correct = [
  {
    type: 'empty string',
    tree: '',
    expected: true,
    expectedCodes: [],
  },
  {
    type: 'single module',
    tree: 'CS1010S',
    expected: true,
    expectedCodes: ['CS1010S'],
  },
  {
    type: 'simple json tree',
    tree: {
      and: ['CS1010', 'CS1231'],
      or: ['MA1100'],
    },
    expected: true,
    expectedCodes: ['CS1010', 'CS1231', 'MA1100'],
  },
  {
    type: 'layered json tree',
    tree: {
      and: [
        {
          or: [
            { or: ['ACC1701', 'ACC1701X', 'EC2204'] },
            'BSP1702',
            'BSP1702X',
          ],
        },
        { or: ['FIN2704', 'FIN2704X'] },
      ],
    },
    expected: true,
    expectedCodes: [
      'ACC1701',
      'ACC1701X',
      'EC2204',
      'BSP1702',
      'BSP1702X',
      'FIN2704X',
      'FIN2704',
    ],
  },
  {
    type: 'array',
    tree: ['CS1010S'],
    expected: false,
    expectedCodes: [],
  },
  {
    type: 'number',
    tree: 9,
    expected: false,
    expectedCodes: [],
  },
  {
    type: 'set',
    tree: new Set(),
    expected: false,
    expectedCodes: [],
  },
  {
    type: 'undefined',
    tree: undefined,
    expected: false,
    expectedCodes: [],
  },
  {
    type: 'null',
    tree: null,
    expected: false,
    expectedCodes: [],
  },
]

describe('validTreeBase', () => {
  test.each(correct)('works on $type', ({ tree, expected }) => {
    expect(validTreeBase(tree as any)).toBe(expected)
  })
})

describe('getNestedCodes', () => {
  test.each(correct)('works on $type', ({ tree, expected, expectedCodes }) => {
    const { valid, codes } = getNestedCodes(tree as any)
    expect(valid).toBe(expected)
    expect(codes).toIncludeSameMembers(expectedCodes)
  })
})
