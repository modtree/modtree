import { ApiResponse } from '@modtree/types'
import type { ReduxState } from './types'

const user: ApiResponse.User = {
  id: '',
  username: '',
  email: '',
  displayName: '',
  facebookId: '',
  googleId: '',
  githubId: '',
  modulesDone: [],
  modulesDoing: [],
  savedDegrees: [],
  savedGraphs: [],
  mainDegree: '',
  mainGraph: '',
  matriculationYear: 0,
  graduationYear: 0,
  graduationSemester: 0,
}

const degree: ApiResponse.Degree = { id: '', title: '', modules: [] }

const graph: ApiResponse.Graph = {
  id: '',
  title: '',
  user: '',
  degree: {
    id: '',
    title: '',
  },
  modulesHidden: [],
  modulesPlaced: [],
  flowEdges: [],
  flowNodes: [],
}

export const baseInitialState: ReduxState = {
  modtree: { user, degree, graph: { ...graph, selectedCodes: [] } },
  modal: {
    showModuleStateGuide: false,
    userProfilePage: 'graphs',
    contextMenuProps: {
      top: 0,
      left: 0,
      menu: 'flowPaneContextMenu',
    },
    showUserProfile: false,
    showContextMenu: false,
    showModuleModal: false,
    showDebugModal: false,
    modalModule: {
      id: '',
      acadYear: '',
      moduleCode: '',
      title: '',
      description: '',
      moduleCredit: '',
      department: '',
      faculty: '',
      aliases: [],
      attributes: {},
      prerequisite: '',
      corequisite: '',
      preclusion: '',
      fulfillRequirements: [],
      semesterData: [],
      prereqTree: '',
      workload: '',
    },
  },
  cache: {
    degrees: {},
    modulesCondensed: {},
    modules: {},
  },
  search: {
    buildId: '',
    buildTitle: '',
    buildList: [],
    searchResults: [],
    module: [],
    hasResults: false,
    degreeTitle: '',
  },
}
