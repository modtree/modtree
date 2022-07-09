import {
  IDegree,
  IGraph,
  IModule,
  IModuleCondensed,
  IModuleFull,
  ModtreeApiResponse,
} from '@modtree/types'
import type { Pages, ContextMenuProps } from 'types'

export type ReduxState = {
  user: ModtreeApiResponse.UserFull
  degree: IDegree
  graph: ModtreeApiResponse.GraphFull & {
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
