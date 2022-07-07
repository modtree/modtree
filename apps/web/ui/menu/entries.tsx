import { Menu } from '@headlessui/react'
import { ReactElement } from 'react'
import { MenuItem } from 'types'
import { flatten } from '@/utils/tailwind'
import { dashed } from '@/utils/array'
import { GraphFlowNode } from '@modtree/types'

export default function Entries(props: {
  items: MenuItem[]
  children?: ReactElement | ReactElement[]
  className?: string
  roundedSelection?: boolean
  flowNode?: GraphFlowNode
}) {
  const { children, className, items } = props

  const onClick = (menuItem: MenuItem) => {
    /**
     * only run the callback if it exists
     */
    if (!menuItem.callback) return
    menuItem.callback(props.flowNode)
  }

  const Children = () => {
    if (!children) return null
    if (Array.isArray(children)) {
      return (
        <>
          {children.map((child, index) => (
            <Menu.Item key={dashed('item-child', index)}>
              <div className="px-4 py-3 text-gray-700">{child}</div>
            </Menu.Item>
          ))}
        </>
      )
    }
    return <Menu.Item>{children}</Menu.Item>
  }

  return (
    <>
      <Children />
      <div className={flatten('py-2', className)}>
        {items.map((menuItem, index) => {
          return (
            <Menu.Item key={dashed(menuItem.text, index)}>
              <a
                href={menuItem.href}
                onClick={() => onClick(menuItem)}
                className={flatten(
                  'hover:bg-modtree-400/80 hover:text-white',
                  'text-gray-700 flex w-full px-4 py-1.5',
                  'hover:no-underline',
                  props.roundedSelection && 'rounded-md'
                )}
              >
                {menuItem.text}
              </a>
            </Menu.Item>
          )
        })}
      </div>
    </>
  )
}
