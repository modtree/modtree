import { showContextMenu } from '@/store/modal'
import { IModule } from '@modtree/types'
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
  module?: IModule
) {
  event.preventDefault()
  console.log(module)
  dispatch(showContextMenu({ left: event.pageX, top: event.pageY, menu }))
}
