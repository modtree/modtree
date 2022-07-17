import type { ReduxState } from './types'
import { empty } from '@modtree/utils'

export const baseInitialState: ReduxState = {
  user: empty.User,
  degree: empty.Degree,
  graph: {
    ...empty.Graph,
    selectedCodes: [],
  },
  modal: {
    userProfilePage: 'public-profile',
    contextMenuProps: {
      top: 0,
      left: 0,
      menu: 'flowPaneContextMenu',
    },
    showUserProfile: false,
    showContextMenu: false,
    showModuleModal: false,
    showDebugModal: false,
    modalModule: empty.ModuleFull,
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
