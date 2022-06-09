import { InitProps } from '@modtree/types'

type Init = {
  degree1: InitProps['Degree']
  degree2: InitProps['Degree']
  user1: InitProps['User']
  user2: InitProps['User']
  user3: InitProps['User']
  emptyUser: InitProps['User']
  graph1: InitProps['Graph']
  invalidUUID: string
  invalidModuleCode: string
}

/**
 * fake data for test cases
 */
export const init: Init = {
  degree1: {
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

  degree2: {
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

  user1: {
    displayName: 'Nguyen Vu Khang',
    username: 'nguyenvukhang',
    email: 'khang@modtree.com',
    modulesDone: ['MA2001'],
    modulesDoing: ['MA2219'],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  },

  user2: {
    displayName: 'Nguyen Vu Khang',
    username: 'nguyenvukhang',
    email: 'khang@modtree.com',
    modulesDone: [
      'MA2001,',
      'MA1100,',
      'HSH1000,',
      'HSA1000,',
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
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
  },

  user3: {
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
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
  },

  graph1: {
    userId: '',
    degreeId: '',
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: true,
  },

  emptyUser: {
    displayName: 'Khang Vu Nguyen',
    username: 'definitelynotkhang',
    email: 'user@modtree.com',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  },

  invalidModuleCode: 'XXYYZZ',

  invalidUUID: 'invalid-uuid',
}
