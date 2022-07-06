import { showContextMenu } from '@/store/modal'
import { GraphFlowNode } from '@modtree/types'
import { empty } from '@modtree/utils'
import { MouseEvent } from 'react'
import { Dispatch } from 'redux'

/**
 * context:
 * Context menu and right-click menu are actually the same thing
 */

export function onContextMenu(
  dispatch: Dispatch,
  event: MouseEvent<Element, globalThis.MouseEvent>,
  menu: 'pane' | 'node',
  node?: GraphFlowNode
) {
  event.preventDefault()
  dispatch(
    showContextMenu({
      left: event.pageX,
      top: event.pageY,
      menu,
      module: node?.data,
    })
  )
}
