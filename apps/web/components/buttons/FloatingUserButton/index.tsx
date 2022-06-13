import { useUser } from '@auth0/nextjs-auth0'
import { ReactElement } from 'react'
import SignedInCircle from './SignedIn'
import SignedOutRect from './SignedOut'

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
export default function FloatingUserButton() {
  const { user, isLoading } = useUser()
  return !isLoading ? (
    <TopRight>{user ? <SignedInCircle /> : <SignedOutRect />}</TopRight>
  ) : null
}
