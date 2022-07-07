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
import { Entries } from '@/ui/menu'

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

function ContextMenuArea(props: {
  children: ReactElement[] | ReactElement
  static?: boolean
}) {
  return (
    <div className="select-none text-right">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Items
          static
          className={flatten(
            'w-48',
            'divide-y',
            'divide-gray-200 rounded-md bg-white shadow-md',
            'focus:outline-none overflow-hidden',
            'py-1 px-1'
          )}
        >
          {props.children}
        </Menu.Items>
      </Menu>
    </div>
  )
}

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
      <ContextMenuArea>
        <Entries items={props.items} roundedSelection flowNode={flowNode} />
      </ContextMenuArea>
    </div>
  ) : null
}

export function ContextMenus() {
  const { showContextMenu, contextMenuProps } = useAppSelector((s) => s.modal)
  const selected = contextMenuProps.menu
  const menus: ContextMenuType[] = [
    'flowNodeContextMenu',
    'flowPaneContextMenu',
  ]
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
