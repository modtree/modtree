import { useState } from 'react'
import { IoPerson } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { UserMenu } from '@/components/menus'
import { UseState } from 'types'

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

export default function FloatingUserButton() {
  const userMenuState = useState(false)

  return (
    <div className="absolute right-4 top-4 select-none">
      <div className="flex flex-col items-right">
        <UserCircleArea userMenuState={userMenuState} />
        {userMenuState[0] && <UserMenu />}
      </div>
    </div>
  )
}
