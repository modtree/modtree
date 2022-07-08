import { ReactElement } from 'react'
import { UserIcon } from '@/ui/icons'
import { useUser } from '@/utils/auth0'
import { DropdownMenu, Entries } from '@/ui/menu'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { hideContextMenu } from '@/store/modal'
import { items } from '@/components/menu-items'
import { flatten } from '@/utils/tailwind'
import Link from 'next/link'

/**
 * user button when the user is signed out
 */
const SignedOutRect = () => {
  const className = flatten(
    'px-4 py-2',
    'inline-flex h-10 centered rounded-md bg-black bg-opacity-20',
    'font-medium text-white hover:bg-opacity-30',
    'hover:no-underline'
  )
  return (
    <Link href="/api/auth/login" passHref>
      <a className={className}>Sign in</a>
    </Link>
  )
}

/**
 * user button when the user is signed in
 */
const SignedInCircle = () => {
  const { user } = useUser()
  const dispatch = useAppDispatch()
  const dev = process.env['NODE_ENV'] === 'development'
  const email = useAppSelector((state) => state.user.email)

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
      <Entries
        items={items.userDropdownMenu.filter(
          (item) => dev || item.text !== 'Debug'
        )}
      >
        <>
          <div>Signed in as{dev && ' (auth0)'}</div>
          <b>{user.nickname}</b>
        </>
        <>
          <div>Email{dev && ' (postgres)'}</div>
          <b>{email}</b>
        </>
      </Entries>
    </DropdownMenu>
  )
}

/**
 * sends this entire operation to the top-right of the screen
 */
const TopRight = (props: { children: ReactElement[] | ReactElement }) => {
  return (
    <div className="absolute right-3 top-3 select-none">{props.children}</div>
  )
}

/**
 * hidden while loading, handles login state.
 */
export function FloatingUserButton() {
  const { user, isLoading } = useUser()
  return !isLoading ? (
    <TopRight>{user ? <SignedInCircle /> : <SignedOutRect />}</TopRight>
  ) : null
}
