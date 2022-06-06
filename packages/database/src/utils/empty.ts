import type * as InitProps from '../../types/init-props'
import type { ResponseProps } from '../../types/api-response'

/** empty init props */
export class EmptyInit {
  /**
   * empty User init props
   */
  static User: InitProps.User = {
    displayName: '',
    username: '',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 0,
    graduationYear: 0,
    graduationSemester: 0,
    email: '',
  }

  /**
   * empty Degree init props
   */
  static Degree: InitProps.Degree = {
    moduleCodes: [],
    title: '',
  }

  /**
   * empty Graph init props
   */
  static Graph: InitProps.Graph = {
    userId: '',
    degreeId: '',
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: false,
  }
}

/** empty API responses */
export const EmptyResponse: ResponseProps = {
  /**
   * empty User response
   */
  User: {
    id: '',
    displayName: '',
    username: '',
    modulesDone: [],
    modulesDoing: [],
    savedGraphs: [],
    savedDegrees: [],
    matriculationYear: 0,
    graduationYear: 0,
    graduationSemester: 0,
    email: '',
  },

  /**
   * empty Degree response
   */
  Degree: {
    id: '',
    modules: [],
    title: '',
  },

  /**
   * empty Graph response
   */
  Graph: {
    id: '',
    user: '',
    degree: '',
    modulesPlaced: [],
    modulesHidden: [],
  },

  /**
   * empty Module response
   */
  Module: {
    id: '',
    acadYear: '',
    moduleCode: '',
    title: '',
    description: '',
    moduleCredit: '',
    department: '',
    faculty: '',
    aliases: [],
    attributes: {
      year: false,
      su: false,
      grsu: false,
      ssgf: false,
      sfs: false,
      lab: false,
      ism: false,
      urop: false,
      fyp: false,
      mpes1: false,
      mpes2: false,
    },
    prerequisite: '',
    corequisite: '',
    preclusion: '',
    fulfillRequirements: [],
    semesterData: [],
    prereqTree: '',
    workload: '',
  },

  /**
   * empty Module Condensed response
   */
  ModuleCondensed: {
    id: '',
    moduleCode: '',
    moduleLevel: 0,
    title: '',
  },
}
