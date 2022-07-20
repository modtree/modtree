import { ModuleFull } from '@modtree/types'
import type { ReduxState } from './types'

export const baseInitialState: ReduxState = {
  user: {
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
  },
  degree: { id: '', title: '', modules: [] },
  graph: {
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
    selectedCodes: [],
  },
  modal: {
    showModuleStateGuide: true,
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
    modalModule: new ModuleFull(),
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
