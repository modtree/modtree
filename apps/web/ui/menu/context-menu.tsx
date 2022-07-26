import { flatten } from '@/utils/tailwind'
import { Menu } from '@headlessui/react'
import { ReactElement, useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import type { GraphFlowNode } from '@modtree/types'
import type { ContextMenuProps, ContextMenuType } from 'types'
import store, { useAppSelector, r, useAppDispatch } from '@/store/redux'
import { dashed } from '@/utils/array'
import { items } from '@/components/menu-items'
import { MenuItem } from 'types'
import { Entries } from './entries'

/**
 * context:
 * Context menu and right-click menu are actually the same thing
 */

/**
 * the trigger to open context menus
 */
export function onContextMenu(
  event: MouseEvent<Element, globalThis.MouseEvent>,
  menu: ContextMenuType,
  node?: GraphFlowNode // the flow node that was right-clicked
) {
  /** suppress the default right-click menu */
  event.preventDefault()
  const dispatch = store.dispatch
  /** send redux signal to open the context menu */
  dispatch(
    r.setContextMenu({
      /**
       * pre-viewport adjustment: opacity 0 is intended
       * upon render, the menu will be adjusted to be fully in the viewport
       * and only then opacity will be set back to 1.
       */
      opacity: 0,
      /** where on the screen to place the menu */
      left: event.pageX,
      top: event.pageY,
      /** which menu to open */
      menu,
      /** data of the node that was right-clicked */
      flowNode: node,
    })
  )
}

/**
 * just a style wrapper for context menus
 */
const ContextMenuWrapper = (props: {
  children: ReactElement[] | ReactElement
}) => (
  <Menu as="div" className="select-none relative inline-block">
    <Menu.Items
      static
      className={flatten(
        'w-48 divide-y py-1 px-1 divide-gray-200 rounded-md bg-white',
        'shadow-md focus:outline-none overflow-hidden'
      )}
      data-cy="context-menu-item"
    >
      {props.children}
    </Menu.Items>
  </Menu>
)

export function ContextMenu(props: {
  items: MenuItem[]
  contextMenuProps: ContextMenuProps
  show: boolean
}) {
  const { top, left, flowNode, opacity } = props.contextMenuProps
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  /**
   * keeps the context menu within the boundaries of the window
   */
  function keepInView() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const dy = Math.min(window.innerHeight - rect.bottom, 0)
      const dx = Math.min(window.innerWidth - rect.right, 0)
      // if no offset is required, and menu is already visible, do nothing
      if (dy === 0 && dx === 0 && opacity === 1) return
      // else, send the dispatch
      dispatch(
        r.setContextMenu({
          opacity: 1,
          top: top + dy,
          left: left + dx,
        })
      )
    }
  }
  /** run keepInView every time new coordinates are dispatched */
  useEffect(() => keepInView(), [top, left])

  return props.show ? (
    <div
      id="modtree-context-menu"
      className="absolute z-20"
      style={{ top, left, opacity }}
      ref={ref}
    >
      <ContextMenuWrapper>
        <Entries items={props.items} roundedSelection flowNode={flowNode} />
      </ContextMenuWrapper>
    </div>
  ) : null
}

/**
 * all the context menus of the project
 * includes show/hide management of each menu
 */
export function ContextMenus() {
  /**
   * fetch redux state
   */
  const contextMenuProps = useAppSelector((s) => s.modal.contextMenuProps)
  const menus: ContextMenuType[] = [
    'flowNodeContextMenu',
    'flowPaneContextMenu',
  ]

  /**
   * render all the menus ahead of time, and only show the selected one
   */
  return (
    <>
      {menus.map((menu, index) => (
        <ContextMenu
          key={dashed('modtree-context', menu, index)}
          show={contextMenuProps.menu === menu}
          contextMenuProps={contextMenuProps}
          items={items[menu]}
        />
      ))}
    </>
  )
}
