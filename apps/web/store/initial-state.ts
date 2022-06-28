import type { ReduxState } from './types'
import { EmptyResponse } from '@modtree/utils'

export const baseInitialState: ReduxState = {
  user: EmptyResponse.User,
  degree: EmptyResponse.Degree,
  graph: {
    ...EmptyResponse.Graph,
    selectedCodes: [],
  },
  modal: {
    userProfilePage: 'public-profile',
    contextMenuProps: {
      top: 0,
      left: 0,
      menu: 'pane',
    },
    showUserProfile: false,
    showContextMenu: false,
    showModuleModal: false,
    showDebugModal: false,
    modalModule: EmptyResponse.Module,
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
  },
}
