import { IoPerson } from 'react-icons/io5'
import { useUser } from '@/utils/auth0'
import UserMenu from './UserMenu'
import { useDispatch } from 'react-redux'
import UserMenuItems from './UserMenuItems'

function UserCircle() {
  const position = 'flex justify-center items-center'
  {
    return (
      <div className={`w-10 h-10 rounded-full modtree-gradient ${position}`}>
        <IoPerson className="text-gray-50 h-5 w-5" />
      </div>
    )
  }
}

export default function SignedInCircle() {
  const { user } = useUser()
  const dispatch = useDispatch()

  return (
    <UserMenu TriggerButton={UserCircle}>
      <UserMenuItems user={user} dispatch={dispatch} />
    </UserMenu>
  )
}
