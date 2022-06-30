import { InitProps } from '@modtree/types'

/** empty init props */
export const emptyInit: InitProps = {
  /**
   * empty User init props
   */
  User: {
    authZeroId: '',
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
    moduleCode: '',
    title: '',
    description: '',
    prerequisite: '',
    corequisite: '',
    preclusion: '',
    prereqTree: '',
    fulfillRequirements: [],
  },

  /**
   * empty Module init props
   */
  ModuleCondensed: {
    moduleCode: '',
    title: '',
  },
}
