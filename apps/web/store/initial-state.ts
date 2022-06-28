import type { ReduxState } from './types'
import { EmptyResponse } from '@modtree/utils'
import { ModtreeApiResponse } from '@modtree/types'

export const baseInitialState: ReduxState = {
  user: EmptyResponse.User,
  degree: EmptyResponse.Degree,
  graph: {
    ...EmptyResponse.Graph,
    selectedCodes: [],
  },
  modal: {
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
    modulesCondensed: new Set<ModtreeApiResponse.ModuleCondensed>(),
    modules: new Set<ModtreeApiResponse.Module>(),
  },
  search: {
    buildList: [],
    searchResults: [],
    module: [],
    hasResults: false,
  },
}
