import { FlowNode, InitProps } from '@modtree/types'
import { empty } from '@modtree/utils'
import { Edge } from 'react-flow-renderer'

type Init = {
  degree1: InitProps['Degree']
  degree2: InitProps['Degree']
  degree3: InitProps['Degree']
  user1: InitProps['User']
  user2: InitProps['User']
  user3: InitProps['User']
  graph1: InitProps['Graph']
  graph2: InitProps['Graph']
  nodes: FlowNode[]
  edges: Edge[]
}

/**
 * fake data for test cases
 */
export const init: Init = {
  degree1: {
    moduleCodes: [
      'MA1100',
      'MA2001',
      'MA2002',
      'MA2101',
      'MA2219',
      'MA2104',
      'MA2213',
      'MA2216',
      'MA2202',
    ],
    title: 'Mathematics',
  },

  degree2: {
    moduleCodes: [
      'CS1101S',
      'CS1231S',
      'CS2030S',
      'CS2040S',
      'CS2100',
      'CS2103T',
      'CS2106',
      'CS2109S',
      'CS3230',
    ],
    title: 'Computer Science',
  },

  degree3: {
    moduleCodes: [
      'PC1101',
      'PC2031',
      'PC2032',
      'PC2130',
      'PC2135',
      'PC2174A',
      'PC2193',
    ],
    title: 'Physics',
  },

  user1: {
    authZeroId: 'auth0|1',
    displayName: 'Nguyen Vu Khang',
    username: 'nguyenvukhang',
    email: 'khang@modtree.com',
    modulesDone: [
      'MA2001',
      'MA1100',
      'HSH1000',
      'HSA1000',
      'GEA1000',
      'IS1103',
      'CS1010S',
      'DTK1234',
      'HS1401S',
      'HSI1000',
      'HSS1000',
      'MA2002',
      'MA2219',
      'PC1432',
    ],
    modulesDoing: ['CP2106'],
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
  },

  user2: {
    authZeroId: 'auth0|2',
    displayName: 'Tan Wei Seng',
    username: 'tanweiseng',
    email: 'weiseng@modtree.com',
    modulesDone: [
      'MA1521',
      'MA2001',
      'CS1231S',
      'CS2100',
      'CS2030S',
      'IS1103',
      'CS2040S',
      'CS2106',
      'MA2101',
      'PC1201',
      'ES2660',
      'ST1131',
      'EL1101E',
      'LAJ2203',
    ],
    modulesDoing: ['CP2106'],
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
  },

  user3: {
    authZeroId: 'auth0|3',
    displayName: 'Anonymous User',
    username: 'anon',
    email: 'anon@modtree.com',
    modulesDone: ['MA2001', 'PC1101'],
    modulesDoing: ['LAJ2203'],
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
  },

  graph1: {
    userId: '',
    degreeId: '',
    modulesPlacedCodes: ['CS1101S', 'CS2030S'],
    modulesHiddenCodes: ['GEA1000', 'MA2001'],
    pullAll: false,
  },

  graph2: {
    userId: '',
    degreeId: '',
    modulesPlacedCodes: ['CS1101S', 'CS2030S'],
    modulesHiddenCodes: ['ST1131', 'IS1103'],
    pullAll: false,
  },

  nodes: [
    {
      id: 'CS1101S',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        ...empty.Module,
      },
    },
    {
      id: 'CS2030S',
      position: {
        x: 100,
        y: 0,
      },
      data: {
        ...empty.Module,
      },
    },
  ],

  edges: [
    {
      id: 'CS1101S-CS2030S',
      source: 'CS1101S',
      target: 'CS2030S',
    },
  ],
}
