import { Menu, Transition } from '@headlessui/react'
import { Fragment, ReactElement } from 'react'

export default function DropdownMenu(props: {
  children: ReactElement[] | ReactElement
  static?: boolean
}) {
  return (
    <div className="select-none text-right">
      <Menu as="div" className="relative inline-block text-left">
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            static
            className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-md focus:outline-none overflow-hidden"
          >
            {props.children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
