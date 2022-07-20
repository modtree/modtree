import { ReactElement } from 'react'
import { UserIcon } from '@/ui/icons'
import { useSession } from '@/utils/auth'
import { DropdownMenu, Entries } from '@/ui/menu'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { hideContextMenu } from '@/store/modal'
import { items } from '@/components/menu-items'
import { flatten } from '@/utils/tailwind'
import { signIn } from 'next-auth/react'
import { devEnv } from '@/utils/env'

/**
 * user button when the user is signed out
 */
const SignedOutRect = () => (
  <button
    onClick={() => signIn()}
    className={flatten(
      'px-4 py-2',
      'inline-flex h-10 centered rounded-md bg-black bg-opacity-20',
      'font-medium text-white hover:bg-opacity-30',
      'hover:no-underline'
    )}
  >
    Sign in
  </button>
)

/**
 * user button when the user is signed in
 * and its accompanying dropdown menu
 */
const SignedInCircle = () => {
  /** read state */
  const { user } = useSession()
  const dispatch = useAppDispatch()
  const email = useAppSelector((state) => state.modtree.user.email)

  /** the button itself */
  const UserCircle = () => (
    <div
      id="modtree-user-circle"
      data-cy="modtree-user-circle"
      className="w-10 h-10 rounded-full modtree-gradient flex centered"
      onClick={() => dispatch(hideContextMenu())}
    >
      <UserIcon className="text-gray-50 h-5 w-5" />
    </div>
  )

  /** the area including the button and the dropdown menu */
  return (
    <DropdownMenu TriggerButton={UserCircle}>
      <Entries items={items.userDropdownMenu}>
        <>
          <div>Signed in as</div>
          <b>{user?.email}</b>
        </>
        {devEnv ? (
          <>
            <div>Email (postgres)</div>
            <b data-cy="email">{email}</b>
          </>
        ) : null}
      </Entries>
    </DropdownMenu>
  )
}

/**
 * sends this entire operation to the top-right of the screen
 */
const TopRight = (props: { children: ReactElement[] | ReactElement }) => (
  <div className="absolute right-3 top-3 select-none">{props.children}</div>
)

/**
 * hidden while loading, handles login state.
 */
export function FloatingUserButton() {
  const { status } = useSession()
  return status === 'loading' ? null : (
    <TopRight>
      {status === 'authenticated' ? <SignedInCircle /> : <SignedOutRect />}
    </TopRight>
  )
}
