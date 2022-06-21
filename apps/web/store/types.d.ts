import { Module, ModuleCondensed } from '@modtree/entity'
import {
  FlowEdgeCondensed,
  FlowNodeCondensed,
  ModtreeApiResponse,
} from '@modtree/types'

export type ModuleCondensedMap = {
  [key: string]: ModtreeApiResponse.ModuleCondensed
}

export type ContextMenuProps = { top: number; left: number }

export type ReduxState = {
  base: {
    user: ModtreeApiResponse.User
    degree: ModtreeApiResponse.Degree
    graph: ModtreeApiResponse.Graph
    modulesCondensed: ModuleCondensedMap
  }
  flow: {
    selection: string[]
    nodes: FlowNodeCondensed[]
    edges: FlowEdgeCondensed[]
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
    moduleCondensed: ModuleCondensed[]
    module: Module[]
    hasResults: boolean
  }
}
