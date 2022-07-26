import { flatten } from '@/utils/tailwind'
import { Menu } from '@headlessui/react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { GraphFlowNode } from '@modtree/types'
import type { ContextMenuProps, ContextMenuType } from 'types'
import store, { useAppSelector, r } from '@/store/redux'
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
    r.showContextMenu({
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

// function keepWithinViewport(
//   contextMenuRef: RefObject<HTMLDivElement>,
//   setOffset: SetState<[number, number]>
// ) {
//   if (contextMenuRef.current) {
//     const rect = contextMenuRef.current.getBoundingClientRect()
//     const offsetY = Math.min(window.innerHeight - rect.bottom, 0)
//     const offsetX = Math.min(window.innerWidth - rect.right, 0)
//     console.log('offset:', offsetX, offsetY, rect.bottom, rect.right)
//     setOffset([offsetX, offsetY])
//   }
// }

export function ContextMenu(props: {
  items: MenuItem[]
  contextMenuProps: ContextMenuProps
  show: boolean
}) {
  const { top, left, flowNode } = props.contextMenuProps
  const [offset, setOffset] = useState([0, 0])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      // console.log(ref.current.clientHeight)
      const rect = ref.current.getBoundingClientRect()
      const offsetY = Math.min(window.innerHeight - rect.bottom, 0)
      const offsetX = Math.min(window.innerWidth - rect.right, 0)
      setOffset([offsetX, offsetY])
    }
    if (!props.show) {
      setOffset([0, 0])
    }
  }, [top, left, props.show])

  return props.show ? (
    <div
      ref={ref}
      id="modtree-context-menu"
      style={{ top: top + offset[1], left: left + offset[0] }}
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
