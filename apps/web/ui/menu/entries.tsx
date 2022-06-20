import { Menu } from '@headlessui/react'
import { createRef, ReactElement } from 'react'
import { MenuItem } from 'types'
import { MenuLink } from './link'
import { flatten } from '@/utils/tailwind'
import { dashed } from '@/utils/array'

export default function MenuItems(props: {
  items: MenuItem[]
  children?: ReactElement | ReactElement[]
  className?: string
  roundedSelection?: boolean
}) {
  const { children, className, items } = props

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
            <Menu.Item key={`${menuItem.text}-${index}`}>
              <MenuLink
                ref={createRef<HTMLAnchorElement>()}
                onClick={menuItem.callback}
                href={menuItem.href || ''}
                className={flatten(
                  'hover:bg-modtree-400/80 hover:text-white',
                  'text-gray-700 flex w-full px-4 py-1.5',
                  props.roundedSelection && 'rounded-md'
                )}
              >
                {menuItem.text}
              </MenuLink>
            </Menu.Item>
          )
        })}
      </div>
    </>
  )
}
