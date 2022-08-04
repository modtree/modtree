import { empty } from '@modtree/types'
import { getDirectSources } from './get-edges'
import '@modtree/test-env/jest'

/**
 * module codes are not necessary, but they are included for reference,
 * as these are mostly real test cases.
 */
const correct = [
  {
    type: 'empty pre-req tree',
    input: {
      ...empty.FlowNode,
      data: {
        ...empty.Module,
        moduleCode: 'CS1010',
        prereqTree: '',
      },
    },
    expected: [],
  },
  {
    type: 'string pre-req tree',
    input: {
      ...empty.FlowNode,
      data: {
        ...empty.Module,
        moduleCode: 'CS2030S',
        prereqTree: 'CS1010',
      },
    },
    expected: ['CS1010'],
  },
  {
    type: 'single OR',
    input: {
      ...empty.FlowNode,
      data: {
        ...empty.Module,
        moduleCode: 'MA2001',
        prereqTree: {
          or: ['MA1301', 'MA1301FC', 'MA1301X'],
        },
      },
    },
    expected: ['MA1301', 'MA1301FC', 'MA1301X'],
  },
  {
    type: 'single AND',
    input: {
      ...empty.FlowNode,
      data: {
        ...empty.Module,
        moduleCode: 'CS3231',
        prereqTree: {
          and: ['CS1231', 'CS2040'],
        },
      },
    },
    expected: ['CS1231', 'CS2040'],
  },
  {
    type: 'single OR and AND',
    input: {
      ...empty.FlowNode,
      data: {
        ...empty.Module,
        moduleCode: 'fake-module',
        prereqTree: {
          or: ['MA2001', 'MA2002'],
          and: ['CS1231', 'CS2040'],
        },
      },
    },
    expected: ['MA2001', 'MA2002', 'CS1231', 'CS2040'],
  },
  {
    type: 'all nested beyond first layer',
    input: {
      ...empty.FlowNode,
      data: {
        ...empty.Module,
        moduleCode: 'CS3230',
        prereqTree: {
          and: [
            {
              or: ['CS2010', 'CS2020', 'CS2040'],
            },
            {
              or: ['MA1100', 'CS1231'],
            },
          ],
        },
      },
    },
    expected: [],
  },
  {
    type: 'ignores beyond first layer',
    input: {
      ...empty.FlowNode,
      data: {
        ...empty.Module,
        moduleCode: 'CS4234',
        prereqTree: {
          and: [
            'CS3230',
            {
              or: ['MA1101R', 'MA1311', 'MA1508E', 'MA1513'],
            },
          ],
        },
      },
    },
    expected: ['CS3230'],
  },
]

test.each(correct)('$type', async ({ input, expected }) => {
  const res = getDirectSources(input)
  expect(res).toIncludeSameMembers(expected)
})
