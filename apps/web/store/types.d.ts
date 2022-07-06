import {
  GraphFlowNode,
  IDegree,
  IGraph,
  IModule,
  IModuleCondensed,
  IModuleFull,
  IUser,
} from '@modtree/types'
import { Pages } from 'types'

export type ModuleCondensedMap = {
  [key: string]: IModuleCondensed
}

export type ContextMenuType = 'node' | 'pane'

export type ContextMenuProps = {
  top: number
  left: number
  menu: ContextMenuType
  flowNode?: GraphFlowNode
}

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
