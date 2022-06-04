import type * as InitProps from '../../types/entity'

/** empty data */
export class EmptyInit {
  /**
   * empty User
   */
  static User: InitProps.User = {
    displayName: '',
    username: '',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 0,
    graduationYear: 0,
    graduationSemester: 0,
    email: ''
  }

  /**
   * empty Degree
   */
  static Degree: InitProps.Degree = {
    moduleCodes: [],
    title: '',
  }

  /**
   * empty Graph
   */
  static Graph: InitProps.Graph = {
    userId: '',
    degreeId: '',
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: false
  }
}
