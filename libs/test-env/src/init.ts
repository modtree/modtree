import { InitDegreeProps, InitGraphProps, InitUserProps } from '@modtree/types'

type Init = {
  degree1: InitDegreeProps
  degree2: InitDegreeProps
  user1: InitUserProps
  user2: InitUserProps
  user3: InitUserProps
  emptyUser: InitUserProps
  graph1: InitGraphProps
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
    authZeroId: 'auth0|1',
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
    authZeroId: 'auth0|2',
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
    authZeroId: 'auth0|3',
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
    title: '',
    userId: '',
    degreeId: '',
  },

  emptyUser: {
    authZeroId: 'auth0|no-modules',
    displayName: '',
    username: '',
    email: '',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 0,
    graduationYear: 0,
    graduationSemester: 0,
  },

  invalidModuleCode: 'XXYYZZ',

  invalidUUID: 'invalid-uuid',
}
