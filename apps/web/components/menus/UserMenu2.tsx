import { UserProfile, useUser } from '@auth0/nextjs-auth0'
import { Menu, Transition } from '@headlessui/react'
import axios from 'axios'
import { Fragment, ReactElement, useEffect, useState } from 'react'
import { IoPerson } from 'react-icons/io5'
import Link from 'next/link'

const TopRight = (props: { children: ReactElement[] | ReactElement }) => {
  return (
    <div className="absolute right-4 top-4 select-none">{props.children}</div>
  )
}

const UserCircleArea = () => {
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

const SignedOutRect = () => {
  const padding = 'px-3'
  const flex = 'flex flex-row'
  const border = 'border border-gray-400 rounded-md'
  const hover = 'hover:bg-gray-200'
  const active = 'active:bg-gray-300'
  return (
    <div
      className={`cursor-pointer items-center h-10 ${flex} ${padding} ${border} ${hover} ${active}`}
    >
      <Link href="/api/auth/login" passHref>
        <div className="text-gray-400">Sign in</div>
      </Link>
    </div>
  )
}

export default function FloatingUserButton() {
  const { user, isLoading } = useUser()
  const [username, setUsername] = useState('')
  return (
    <TopRight>
      {user ? <SignedInCircle user={user} /> : <SignedOutRect />}
    </TopRight>
  )
}

function SignedInCircle(props: { user: UserProfile }) {
  const { user } = props
  const [username, setUsername] = useState('')

  const getUsername = async (email: string) => {
    axios
      .post('http://localhost:8080/user', {
        email,
      })
      .then((res) => {
        setUsername(res.data.result.username)
      })
  }

  useEffect(() => {
    if (user && user.email) getUsername(user.email)
  }, [user])

  const menuItems = [
    { text: 'Your profile', callback: () => alert('your profile') },
    { text: 'Settings', callback: () => alert('open settings') },
    {
      text: 'Sign out',
      href: '/api/auth/logout',
    },
  ]
  return (
    <div className="select-none text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="focus:outline-none rounded-full shadow-md">
            <UserCircleArea />
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
                  <div className="flex w-full">Username: {username}</div>
                </div>
              </Menu.Item>
            </div>
            <div className="py-2">
              {menuItems.map((menuItem, index) => (
                <Menu.Item key={`${menuItem.text}-${index}`}>
                  <Link href={menuItem.href || '#'} passHref>
                    <a
                      className="hover:bg-blue-500 hover:text-white text-gray-900 flex w-full px-4 py-1.5 text-sm"
                      onClick={menuItem.callback}
                    >
                      {menuItem.text}
                    </a>
                  </Link>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
