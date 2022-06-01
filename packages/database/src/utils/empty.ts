import { Init } from '../../types/entity'

export namespace emptyInit {
  /**
   * empty User
   */
  export const User: Init.UserProps = {
    displayName: '',
    username: '',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 0,
    graduationYear: 0,
    graduationSemester: 0,
  }

  /**
   * empty Degree
   */
  export const Degree: Init.DegreeProps = {
    moduleCodes: [],
    title: '',
  }

  /**
   * empty Graph
   */
  export const Graph: Init.GraphProps = {
    userId: '',
    degreeId: '',
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: false
  }
}
