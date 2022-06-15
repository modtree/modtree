import { useUser } from '@auth0/nextjs-auth0'
import { useDispatch, useSelector } from 'react-redux'
import { getBaseUserData, UserState } from '@/store/base'
import { ModtreeApiResponse } from '@modtree/types'
import { useEffect } from 'react'

export default function ModulesDone() {
  const { user } = useUser()
  const dispatch = useDispatch()
  const reduxUser = useSelector<UserState, ModtreeApiResponse.User>(
    (state) => state.base.user
  )

  useEffect(() => {
    if (user && user.email) getBaseUserData(dispatch, user.email)
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
