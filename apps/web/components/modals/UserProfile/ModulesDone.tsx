import { useDispatch, useSelector } from 'react-redux'
import {
  getModulesCondensed,
  UserState,
  ModuleCondensedMap,
} from '@/store/base'
import { ModtreeApiResponse } from '@modtree/types'
import { useEffect } from 'react'

export default function ModulesDone() {
  const dispatch = useDispatch()
  const reduxUser = useSelector<UserState, ModtreeApiResponse.User>(
    (state) => state.base.user
  )
  const reduxModulesCondensed = useSelector<UserState, ModuleCondensedMap>(
    (state) => state.base.modulesCondensed
  )

  useEffect(() => {
    const modules = reduxUser.modulesDone.concat(reduxUser.modulesDoing)
    getModulesCondensed(dispatch, modules)
  }, [])

  return (
    <div className="w-full h-96">
      <div className="mx-auto w-full h-full max-w-md">
        <div className="space-y-2 h-full overflow-y-scroll">
          {reduxUser.modulesDone.map((code: string) => (
            <div
              key={code}
              className="bg-modtree-300 text-sm text-white rounded-lg px-5 py-2 shadow-md"
            >
              <span className="font-semibold">{code}</span>{' '}
              <span className="text-modtree-50">
                {reduxModulesCondensed[code] &&
                  reduxModulesCondensed[code].title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
