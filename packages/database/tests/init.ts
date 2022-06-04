import type * as InitProps from '../types/entity'

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
