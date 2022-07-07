import { showContextMenu } from '@/store/modal'
import { GraphFlowNode } from '@modtree/types'
import { MouseEvent } from 'react'
import { Dispatch } from 'redux'
import type { ContextMenuType } from 'types'

/**
 * context:
 * Context menu and right-click menu are actually the same thing
 */

export function onContextMenu(
  dispatch: Dispatch,
  event: MouseEvent<Element, globalThis.MouseEvent>,
  menu: ContextMenuType,
  node?: GraphFlowNode
) {
  event.preventDefault()
  dispatch(
    showContextMenu({
      left: event.pageX,
      top: event.pageY,
      menu,
      flowNode: node,
    })
  )
}
