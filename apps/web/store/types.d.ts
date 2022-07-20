import {
  IDegree,
  IModule,
  IModuleCondensed,
  IModuleFull,
  ApiResponse,
} from '@modtree/types'
import type { Pages, ContextMenuProps } from 'types'

export type ReduxState = {
  modtree: {
    user: ApiResponse.User
    degree: ApiResponse.Degree
    graph: ApiResponse.Graph & {
      selectedCodes: string[]
    }
  }
  modal: {
    showModuleStateGuide: boolean
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
    buildList: string[]
    searchResults: IModule[]
    module: IModule[]
    hasResults: boolean
    degreeTitle: string
  }
}
