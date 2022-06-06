import type * as InitProps from '../types/init-props'

/**
 * fake data for test cases
 */
export default class Init {
  static degree1: InitProps.Degree = {
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
  }

  static degree2: InitProps.Degree = {
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
  }

  static user1: InitProps.User = {
    displayName: 'Nguyen Vu Khang',
    username: 'nguyenvukhang',
    email: 'khang@modtree.com',
    modulesDone: ['MA2001'],
    modulesDoing: ['MA2219'],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  }

  static user2: InitProps.User = {
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
  }

  static user3: InitProps.User = {
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
  }

  static graph1: InitProps.Graph = {
    userId: '',
    degreeId: '',
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: true,
  }

  static emptyUser: InitProps.User = {
    displayName: 'Khang Vu Nguyen',
    username: 'definitelynotkhang',
    email: 'user@modtree.com',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  }

  static invalidModuleCode = 'XXYYZZ'

  static invalidUUID = 'invalid-uuid'
}
