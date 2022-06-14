import { IoPerson } from 'react-icons/io5'
import { useUser } from '@auth0/nextjs-auth0'
import { Menu } from '@headlessui/react'
import axios from 'axios'
import { useEffect } from 'react'
import DropdownMenu, { MenuLink } from './DropdownMenu'
import { useDispatch, useSelector } from 'react-redux'
import { showUserProfile } from '@/store/modal'
import { setBaseUser, UserState } from '@/store/base'
import { ModtreeApiResponse } from '@modtree/types'

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
  const reduxUser = useSelector<UserState, ModtreeApiResponse.User>(
    (state) => state.base.user
  )

  const getBaseUserData = async (email: string) => {
    const backend = process.env.NEXT_PUBLIC_BACKEND
    axios
      .post(`${backend}/user/get-by-email`, {
        email,
      })
      .then((res) => {
        dispatch(setBaseUser(res.data))
      })
      .catch(() => console.log('User not found. Own time own target carry on.'))
  }

  useEffect(() => {
    if (user && user.email) getBaseUserData(user.email)
  }, [user])

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
            <div className="flex w-full font-bold">{user?.email}</div>
          </div>
        </Menu.Item>
      </div>
      <div>
        <Menu.Item>
          <div className="px-4 py-3 text-sm text-gray-900">
            <div className="flex w-full">Username: {reduxUser.username}</div>
          </div>
        </Menu.Item>
      </div>
      <div className="py-2">
        {menuItems.map((menuItem, index) => (
          <Menu.Item key={`${menuItem.text}-${index}`}>
            <MenuLink href={menuItem.href || ''} passHref>
              <a
                className="hover:bg-modtree-400/80 hover:text-white text-gray-900 flex w-full px-4 py-1.5 text-sm"
                onClick={menuItem.callback}
              >
                {menuItem.text}
              </a>
            </MenuLink>
          </Menu.Item>
        ))}
      </div>
    </DropdownMenu>
  )
}
