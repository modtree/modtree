import { InitProps } from '../../types/init-props'
import { ResponseProps } from '../../types/api-response'

/** empty init props */
export const EmptyInit: InitProps = {
  /**
   * empty User init props
   */
  User: {
    displayName: '',
    username: '',
    modulesDone: [],
    modulesDoing: [],
    matriculationYear: 0,
    graduationYear: 0,
    graduationSemester: 0,
    email: '',
  },

  /**
   * empty Degree init props
   */
  Degree: {
    moduleCodes: [],
    title: '',
  },

  /**
   * empty Graph init props
   */
  Graph: {
    userId: '',
    degreeId: '',
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: false,
  },

  /**
   * empty Module init props
   */
  Module: {
    acadYear: '',
    // Basic info
    moduleCode: '',
    title: '',
    // Additional info
    description: '',
    moduleCredit: '',
    department: '',
    faculty: '',
    workload: '',
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
    // Requsites
    prerequisite: '',
    corequisite: '',
    preclusion: '',
    // Semester data
    semesterData: [],
    // Requisite tree
    prereqTree: '',
    fulfillRequirements: [],
  },

  /**
   * empty Module init props
   */
  ModuleCondensed: {
    moduleCode: '',
    title: '',
    semesters: [],
  },
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
