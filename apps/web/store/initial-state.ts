import type { ReduxState } from './types'
import { EmptyResponse } from '@modtree/utils'

export const baseInitialState: ReduxState = {
  base: {
    user: EmptyResponse.User,
    degree: EmptyResponse.Degree,
    graph: EmptyResponse.Graph,
    modulesCondensed: {},
  },
  flow: {
    selection: [],
    nodes: [],
    edges: [],
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
  search: {
    searchResults: [],
    module: [],
    hasResults: false,
  },
}
