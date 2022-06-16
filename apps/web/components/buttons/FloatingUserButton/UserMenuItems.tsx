import { Menu } from '@headlessui/react'
import { createRef } from 'react'
import { ModtreeUserContext } from 'types'
import { MenuLink } from './MenuLink'
import { Dispatch } from 'redux'
import { showDebugModal, showUserProfile } from '@/store/modal'

export default function UserMenuItems(props: {
  dispatch: Dispatch
  user: ModtreeUserContext['user']
}) {
  const { dispatch, user } = props
  const menuItems = [
    { text: 'Your profile', callback: () => dispatch(showUserProfile()) },
    { text: 'Settings', callback: () => alert('open settings') },
    {
      text: 'Sign out',
      href: '/api/auth/logout',
    },
  ]
  if (process.env['NODE_ENV'] === 'development') {
    menuItems.splice(1, 0, {
      text: 'Debug',
      callback: () => dispatch(showDebugModal()),
    })
  }

  return (
    <>
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
          const className =
            'hover:bg-modtree-400/80 hover:text-white ' +
            'text-gray-900 flex w-full px-4 py-1.5 text-sm'
          return (
            <Menu.Item key={`${menuItem.text}-${index}`}>
              <MenuLink
                ref={ref}
                href={menuItem.href || ''}
                className={className}
                onClick={menuItem.callback}
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
