import { IoPerson } from 'react-icons/io5'
import { useUser } from '@/utils/auth0'
import { Menu } from '@headlessui/react'
import { createRef } from 'react'
import DropdownMenu, { MenuLink } from './DropdownMenu'
import { useDispatch } from 'react-redux'
import { showUserProfile } from '@/store/modal'

function UserCircleArea() {
  const bg = 'bg-gradient-to-r from-pink-400 to-orange-400'
  const position = 'flex justify-center items-center'
  {
    return (
      <div className={`w-10 h-10 rounded-full ${bg} ${position}`}>
        <IoPerson className="text-gray-50 h-5 w-5" />
      </div>
    )
  }
}

export default function SignedInCircle() {
  const { user } = useUser()
  const dispatch = useDispatch()
  console.log(user.modtree)

  const menuItems = [
    { text: 'Your profile', callback: () => dispatch(showUserProfile()) },
    { text: 'Settings', callback: () => alert('open settings') },
    {
      text: 'Sign out',
      href: '/api/auth/logout',
    },
  ]

  return (
    <DropdownMenu TriggerButton={UserCircleArea}>
      <div>
        <Menu.Item>
          <div className="px-4 py-3 text-sm text-gray-900">
            <div className="flex w-full">Signed in as</div>
            <div className="flex w-full font-bold">{user.email}</div>
          </div>
        </Menu.Item>
      </div>
      <div>
        <Menu.Item>
          <div className="px-4 py-3 text-sm text-gray-900">
            <div className="flex w-full">Username: {user.modtree.email}</div>
          </div>
        </Menu.Item>
      </div>
      <div className="py-2">
        {menuItems.map((menuItem, index) => {
          const ref = createRef<HTMLAnchorElement>()
          return (
            <Menu.Item key={`${menuItem.text}-${index}`}>
              <MenuLink
                ref={ref}
                href={menuItem.href || ''}
                className="hover:bg-modtree-400/80 hover:text-white text-gray-900 flex w-full px-4 py-1.5 text-sm"
                onClick={menuItem.callback}
              >
                {menuItem.text}
              </MenuLink>
            </Menu.Item>
          )
        })}
      </div>
    </DropdownMenu>
  )
}
