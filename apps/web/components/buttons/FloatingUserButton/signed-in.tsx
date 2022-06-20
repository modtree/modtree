import { UserIcon } from '@heroicons/react/solid'
import { useUser } from '@/utils/auth0'
import DropdownMenu, { MenuItems } from '@/components/dropdown-menu'
import { useDispatch } from 'react-redux'
import { hideContextMenu, showDebugModal, showUserProfile } from '@/store/modal'
import { DropdownMenuEntry } from '@/types'

export default function SignedInCircle() {
  const { user } = useUser()
  const dispatch = useDispatch()
  const dev = process.env['NODE_ENV'] === 'development'

  const items: DropdownMenuEntry[] = [
    { text: 'Your profile', callback: () => dispatch(showUserProfile()) },
    {
      text: 'Debug',
      callback: () => dispatch(showDebugModal()),
    },
    { text: 'Settings', callback: () => alert('open settings') },
    {
      text: 'Sign out',
      href: '/api/auth/logout',
    },
  ]

  const UserCircle = () => (
    <div
      className="w-10 h-10 rounded-full modtree-gradient flex centered"
      onClick={() => dispatch(hideContextMenu())}
    >
      <UserIcon className="text-gray-50 h-5 w-5" />
    </div>
  )

  return (
    <DropdownMenu TriggerButton={UserCircle}>
      <MenuItems
        dispatch={dispatch}
        items={items.filter((item) => dev || item.text !== 'Debug')}
      >
        <>
          <div>Signed in as{dev && ' (auth0)'}</div>
          <b>{user.nickname}</b>
        </>
        <>
          <div>Email{dev && ' (postgres)'}</div>
          <b>{user.modtree?.email}</b>
        </>
      </MenuItems>
    </DropdownMenu>
  )
}
