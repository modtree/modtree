import { useSelector } from 'react-redux'
import { UserState } from '@/store/base'
import { ModtreeApiResponse } from '@modtree/types'

export default function ModulesDone() {
  const reduxUser = useSelector<UserState, ModtreeApiResponse.User>(
    (state) => state.base.user
  )

  return (
    <div className="w-full h-full">
      <div className="mx-auto w-full h-full max-w-md">
        <div className="space-y-2 h-full overflow-y-scroll">
          {reduxUser.modulesDone.map((code: string) => (
            <div
              key={code}
              className="bg-modtree-300 text-white rounded-lg px-5 py-2"
            >
              {code}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
