import { useUser } from '@auth0/nextjs-auth0'
import { useDispatch, useSelector } from 'react-redux'
import { setBaseUser, UserState } from '@/store/base'
import { ModtreeApiResponse } from '@modtree/types'
import axios from 'axios'
import { useEffect } from 'react'

export default function ModulesDone() {
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

  return (
    <div className="w-full h-full">
      <div className="mx-auto w-full h-full max-w-md">
        <div className="space-y-2 h-full overflow-y-scroll">
          {reduxUser.modulesDone.map((code: string) => (
            <div className="bg-modtree-300 text-white rounded-lg px-5 py-2">
              {code}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
