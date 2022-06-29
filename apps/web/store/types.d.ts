import { Pages } from '@/types'
import { Module, ModuleCondensed } from '@modtree/entity'
import { ModtreeApiResponse } from '@modtree/types'

export type ModuleCondensedMap = {
  [key: string]: ModuleCondensed
}

export type ContextMenuProps = {
  top: number
  left: number
  menu: 'pane' | 'node'
}

export type ReduxState = {
  user: ModtreeApiResponse.User
  degree: ModtreeApiResponse.Degree
  graph: ModtreeApiResponse.Graph & {
    selectedCodes: string[]
  }
  modal: {
    userProfilePage: Pages['UserProfile']
    showUserProfile: boolean
    showModuleModal: boolean
    showDebugModal: boolean
    showContextMenu: boolean
    contextMenuProps: ContextMenuProps
    modalModule: ModtreeApiResponse.Module
  }
  cache: {
    modulesCondensed: Record<string, ModuleCondensed>
    modules: Record<string, ModtreeApiResponse.Module>
    degrees: Record<string, ModtreeApiResponse.Degree>
  }
  search: {
    buildId: string
    buildTitle: string
    buildList: Module[]
    searchResults: ModuleCondensed[]
    module: Module[]
    hasResults: boolean
  }
}
