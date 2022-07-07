import { flatten } from '@/utils/tailwind'
import { Menu } from '@headlessui/react'
import { showContextMenu } from '@/store/modal'
import { Dispatch } from 'redux'
import type { ReactElement } from 'react'
import type { MouseEvent } from 'react'
import type { GraphFlowNode } from '@modtree/types'
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

export default function ContextMenu(props: {
  children: ReactElement[] | ReactElement
  static?: boolean
  className?: string
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
            props.className
          )}
        >
          {props.children}
        </Menu.Items>
      </Menu>
    </div>
  )
}
