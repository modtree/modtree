import { Module, ModuleCondensed } from '@modtree/entity'
import { ModtreeApiResponse } from '@modtree/types'

export type ModuleCondensedMap = {
  [key: string]: ModtreeApiResponse.ModuleCondensed
}

export type ContextMenuProps = {
  top: number
  left: number
  menu: 'pane' | 'node'
}

export type ReduxState = {
  graph: ModtreeApiResponse.Graph & {
    selectedCodes: string[]
  }
  modal: {
    showUserProfile: boolean
    showModuleModal: boolean
    showDebugModal: boolean
    showContextMenu: boolean
    contextMenuProps: ContextMenuProps
    modalModule: ModtreeApiResponse.Module
  }
  search: {
    buildList: ModuleCondensed[]
    searchResults: ModuleCondensed[]
    module: Module[]
    hasResults: boolean
  }
}
