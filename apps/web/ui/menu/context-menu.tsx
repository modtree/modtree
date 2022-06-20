import { flatten } from '@/utils/tailwind'
import { Menu } from '@headlessui/react'
import { ReactElement } from 'react'

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
