import { hideContextMenu, showContextMenu } from '@/store/modal'
import { MouseEvent } from 'react'
import { Dispatch } from 'redux'

/**
 * context:
 * Context menu and right-click menu are actually the same thing
 */

type Event = globalThis.MouseEvent

export function onContextMenu(
  dispatch: Dispatch,
  event: MouseEvent<Element, globalThis.MouseEvent>,
  menu: 'pane' | 'node'
) {
  const getMenu = () => document.getElementById('modtree-context-menu')
  /**
   * suppress the default right-click menu
   */
  event.preventDefault()
  /**
   * set redux state to open the menu
   */
  dispatch(showContextMenu({ left: event.pageX, top: event.pageY, menu }))
  /**
   * hides the context menu upon any click outside the menu
   */
  ;(() => {
    const outsideClickListener = (event: Event) => {
      const menu = getMenu()
      /**
       * if a click happens outside the context menu,
       * then close the context menu, and remove the listener
       */
      if (menu !== null && !menu.contains(event.target as Node)) {
        dispatch(hideContextMenu())
        detach()
      }
    }
    const detach = () => {
      document.removeEventListener('click', outsideClickListener)
    }
    if (getMenu() === null) {
      document.addEventListener('click', outsideClickListener)
    }
  })()
}
