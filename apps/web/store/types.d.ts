import {
  IDegree,
  IGraph,
  IModule,
  IModuleCondensed,
  IModuleFull,
  IUser,
} from '@modtree/types'
import type { Pages, ContextMenuProps } from 'types'

export type ReduxState = {
  user: IUser
  degree: IDegree
  graph: IGraph & {
    selectedCodes: string[]
  }
  modal: {
    userProfilePage: Pages['UserProfile']
    showUserProfile: boolean
    showModuleModal: boolean
    showDebugModal: boolean
    showContextMenu: boolean
    contextMenuProps: ContextMenuProps
    modalModule: IModuleFull
  }
  cache: {
    modulesCondensed: Record<string, IModuleCondensed>
    modules: Record<string, IModule>
    degrees: Record<string, IDegree>
  }
  search: {
    buildId: string
    buildTitle: string
    buildList: IModule[]
    searchResults: IModule[]
    module: IModule[]
    hasResults: boolean
  }
}
