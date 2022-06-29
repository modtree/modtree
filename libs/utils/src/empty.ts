import {
  ModtreeApiResponse,
  InitProps,
  Modify,
  IGraph,
  IUser,
  IModule,
  IDegree,
} from '@modtree/types'

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
  },
}

/**
 * In the modified types, arrays take the actual entity type to
 * follow the redux types in the frontend.
 *
 * We don't want things like `Module[] | string[]` because TypeScript
 * will only allow you to do things that apply to both possible types.
 */
export type EmptyResponseProps = {
  User: Modify<
    IUser,
    {
      modulesDone: IModule[]
      modulesDoing: IModule[]
      savedDegrees: IDegree[]
      savedGraphs: IGraph[]
      mainDegree: string
      mainGraph: string
    }
  >
  Degree: ModtreeApiResponse.Degree
  Module: ModtreeApiResponse.Module
  Graph: Modify<
    IGraph,
    {
      user: string
      degree: string
      modulesPlaced: IModule[]
      modulesHidden: IModule[]
    }
  >
  ModuleCondensed: ModtreeApiResponse.ModuleCondensed
}

/** empty API responses */
export const EmptyResponse: EmptyResponseProps = {
  /**
   * empty User response
   */
  User: {
    id: '',
    authZeroId: '',
    displayName: '',
    username: '',
    modulesDone: [],
    modulesDoing: [],
    savedGraphs: [],
    mainGraph: '',
    savedDegrees: [],
    mainDegree: '',
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
    flowNodes: [],
    flowEdges: [],
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
