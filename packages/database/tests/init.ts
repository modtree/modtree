import { Init } from '../types/modtree'

export namespace init {
  export const degree1: Init.DegreeProps = {
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
  export const user1: Init.UserProps = {
    displayName: 'Nguyen Vu Khang',
    username: 'nguyenvukhang',
    modulesDone: ['MA2001'],
    modulesDoing: ['MA2219'],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  }
  export const emptyUser: Init.UserProps = {
    displayName: 'Khang Vu Nguyen',
    username: 'definitelynotkhang',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  }
  export const invalidModuleCode = 'XXYYZZ'
  export const invalidUUID = 'invalid-uuid'
}
