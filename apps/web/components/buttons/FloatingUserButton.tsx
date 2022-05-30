import { ReactElement, useState } from 'react'
import { IoPerson } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { UserMenu } from '@/components/menus'
import { UseState } from 'types'
import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'

const UserCircleArea = (props: { userMenuState: UseState<boolean> }) => {
  const [userMenu, setUserMenu] = props.userMenuState
  const Circle = () => {
    const bg = 'bg-gradient-to-r from-pink-400 to-orange-400'
    return (
      <div
        className={`flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-50 active:bg-gray-200 cursor-pointer shadow-xl ${bg}`}
        onClick={() => setUserMenu(!userMenu)}
      >
        <IoPerson color={colors.gray[50]} size={20} />
      </div>
    )
  }
  return (
    <div className="flex flex-row">
      <div className="flex-1" />
      <Circle />
    </div>
  )
}

const SignedInCircle = () => {
  const userMenuState = useState(false)
  return (
    <div className="flex flex-col items-right">
      <UserCircleArea userMenuState={userMenuState} />
      {userMenuState[0] && <UserMenu />}
    </div>
  )
}

const SignedOutRect = () => {
  const padding = 'px-3'
  const flex = 'flex flex-row'
  const border = 'border border-gray-400 rounded-md'
  const hover = 'hover:bg-gray-300'
  const active = 'active:bg-gray-400/25'
  return (
    <div
      className={` items-center h-10 ${flex} ${padding} ${border} ${hover} ${active}`}
    >
      <Link href="/api/auth/login">
        <div className="text-gray-400">Sign in</div>
      </Link>
    </div>
  )
}

const TopRight = (props: { children: ReactElement[] | ReactElement }) => {
  return (
    <div className="absolute right-4 top-4 select-none">{props.children}</div>
  )
}

export default function FloatingUserButton() {
  const { user, isLoading } = useUser()
  if (isLoading) return null
  return <TopRight>{user ? <SignedInCircle /> : <SignedOutRect />}</TopRight>
}
