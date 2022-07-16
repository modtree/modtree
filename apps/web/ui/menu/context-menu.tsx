import { flatten } from '@/utils/tailwind'
import { Menu } from '@headlessui/react'
import { showContextMenu } from '@/store/modal'
import { Dispatch } from 'redux'
import type { ReactElement } from 'react'
import type { MouseEvent } from 'react'
import type { GraphFlowNode } from '@modtree/types'
import type { ContextMenuProps, ContextMenuType } from 'types'
import { useAppSelector } from '@/store/redux'
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
  dispatch: Dispatch,
  event: MouseEvent<Element, globalThis.MouseEvent>,
  menu: ContextMenuType,
  node?: GraphFlowNode // the flow node that was right-clicked
) {
  /** suppress the default right-click menu */
  event.preventDefault()
  /** send redux signal to open the context menu */
  dispatch(
    showContextMenu({
      /**
       * where on the screen to place the menu
       */
      left: event.pageX,
      top: event.pageY,
      /**
       * which menu to open
       */
      menu,
      /**
       * data of the node that was right-clicked
       */
      flowNode: node,
    })
  )
}

/**
 * just a wrapper for context menus
 */
const ContextMenuWrapper = (props: {
  children: ReactElement[] | ReactElement
  static?: boolean
}) => (
  <Menu
    as="div"
    className="select-none text-right relative inline-block text-left"
  >
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
  const { top, left, flowNode } = props.contextMenuProps
  return props.show ? (
    <div
      id="modtree-context-menu"
      style={{ top, left }}
      className="absolute z-20"
    >
      <ContextMenuWrapper>
        <Entries items={props.items} roundedSelection flowNode={flowNode} />
      </ContextMenuWrapper>
    </div>
  ) : null
}

export function ContextMenus() {
  /**
   * fetch redux state
   */
  const { showContextMenu, contextMenuProps } = useAppSelector((s) => s.modal)
  const selected = contextMenuProps.menu
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
          show={showContextMenu && selected === menu}
          contextMenuProps={contextMenuProps}
          items={items[menu]}
        />
      ))}
    </>
  )
}
