import { useUser } from '@/utils/auth0'
import { ReactElement } from 'react'
import SignedInCircle from './signed-in'
import SignedOutRect from './signed-out'

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
