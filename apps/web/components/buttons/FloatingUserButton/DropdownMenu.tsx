import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { FC, ForwardedRef, forwardRef, Fragment, ReactElement } from 'react'

function getMenuLink() {
  const MenuLink = forwardRef(
    (
      props: {
        href: string
        children: string
        className: string
        onClick: () => void
      },
      ref: ForwardedRef<HTMLAnchorElement>
    ) => {
      const { href, children, className, onClick } = props
      return (
        <Link href={href} passHref>
          <a className={className} onClick={onClick} ref={ref}>
            {children}
          </a>
        </Link>
      )
    }
  )
  MenuLink.displayName = 'MenuLink'
  return MenuLink
}

export const MenuLink = getMenuLink()

export default function DropdownMenu(props: {
  TriggerButton: FC
  children: ReactElement[] | ReactElement
}) {
  const { TriggerButton } = props
  return (
    <div className="select-none text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="focus:outline-none rounded-full shadow-md">
            <TriggerButton />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-md focus:outline-none overflow-hidden">
            {props.children}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
