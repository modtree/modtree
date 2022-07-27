import { Menu } from '@headlessui/react'
import { ReactElement } from 'react'
import { MenuItem } from 'types'
import { cc } from '@/utils/tailwind'
import { dashed } from '@/utils/array'
import { GraphFlowNode } from '@modtree/types'

/**
 * handles undefined, single, and array of children
 * always returns exactly one safe React Element
 */
const Children = (props: {
  elements?: ReactElement | (ReactElement | null)[]
}): ReactElement => {
  const { elements } = props
  if (!elements) return <></>
  if (Array.isArray(elements)) {
    return (
      <>
        {elements.filter(Boolean).map((child, index) => (
          <Menu.Item key={dashed('item-child', index)}>
            <div className="px-4 py-3 text-gray-700">{child}</div>
          </Menu.Item>
        ))}
      </>
    )
  }
  return <Menu.Item>{elements}</Menu.Item>
}

export function Entries(props: {
  items: MenuItem[]
  children?: ReactElement | (ReactElement | null)[]
  roundedSelection?: boolean
  flowNode?: GraphFlowNode
}) {
  const onClick = (menuItem: MenuItem) => {
    /**
     * only run the callback if it exists
     */
    if (!menuItem.callback) return
    const node = props.flowNode
    if (node) {
      menuItem.callback(node)
    } else {
      menuItem.callback()
    }
  }

  return (
    <>
      <Children elements={props.children} />
      <div className="py-2">
        {props.items.map((menuItem, index) => (
          <Menu.Item key={dashed(menuItem.text, index)}>
            <a
              href={menuItem.href}
              onClick={() => onClick(menuItem)}
              className={cc(
                'hover:bg-modtree-400/80 hover:text-white',
                'text-gray-700 flex w-full px-4 py-1.5',
                'hover:no-underline',
                props.roundedSelection ? 'rounded-md' : ''
              )}
            >
              {menuItem.text}
            </a>
          </Menu.Item>
        ))}
      </div>
    </>
  )
}
