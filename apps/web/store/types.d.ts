import { Pages } from '@/types'
import { Module, ModuleCondensed } from '@modtree/entity'
import { Modtree } from 'types'

export type ModuleCondensedMap = {
  [key: string]: ModuleCondensed
}

export type ContextMenuProps = {
  top: number
  left: number
  menu: 'pane' | 'node'
}

export type ReduxState = {
  user: Modtree.User
  degree: Modtree.Degree
  graph: Modtree.Graph & {
    selectedCodes: string[]
  }
  modal: {
    userProfilePage: Pages['UserProfile']
    showUserProfile: boolean
    showModuleModal: boolean
    showDebugModal: boolean
    showContextMenu: boolean
    contextMenuProps: ContextMenuProps
    modalModule: Modtree.Module
  }
  cache: {
    modulesCondensed: Record<string, ModuleCondensed>
    modules: Record<string, Modtree.Module>
    degrees: Record<string, Modtree.Degree>
  }
  search: {
    buildId: string
    buildTitle: string
    buildList: ModuleCondensed[]
    searchResults: ModuleCondensed[]
    module: Module[]
    hasResults: boolean
  }
}
