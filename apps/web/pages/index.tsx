import { FloatingActionButton, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import ModtreeFlow from '@/flow'
import { HomeLoader } from '@/components/Loader'
import { useUser } from '@/utils/auth0'
import { useEffect, useState } from 'react'
import { ContextMenus } from '@/components/context-menu'
import { ModuleInfoModal, DebugModal } from '@/components/modals'
import { UserProfileModal } from '@/components/user-profile'
import { RootSearchBox } from '@/ui/search'
import { useAppDispatch } from '@/store/redux'
import { setUser } from '@/store/user'
import { setDegree } from '@/store/degree'
import { backend } from '../utils'

export default function Modtree() {
  const { isLoading, user } = useUser()
  const [loader, setLoader] = useState(true)
  const dispatch = useAppDispatch()

  /**
   * load current user, current graph, current degree
   */
  useEffect(() => {
    if (user) {
      backend
        .post(`/user/${user.sub}/login`, {
          email: user.email,
        })
        .then((res) => dispatch(setUser(res.data)))
      backend
        .get(`/degree/${user.modtree.savedDegrees[0]}`)
        .then((res) => dispatch(setDegree(res.data)))
    }
  }, [isLoading])

  /**
   * loading icon
   */
  useEffect(() => {
    const fn = setTimeout(() => {
      setLoader(false)
    }, 1000)
    return () => clearTimeout(fn)
  }, [])

  return (
    <div className="fixed inset-0 bg-gray-50">
      {isLoading || loader ? (
        <div className="h-full flex flex-col items-center justify-center">
          <HomeLoader />
          <div className="text-neutral-500 font-medium translate-y-[-24px]">
            modtree
          </div>
        </div>
      ) : (
        <>
          <ModtreeFlow />
          <RootSearchBox />
          <FullScreenOverlay>
            <FloatingUserButton />
            <FloatingActionButton />
          </FullScreenOverlay>
          <UserProfileModal />
          <DebugModal />
          <ModuleInfoModal />
          <ContextMenus />
        </>
      )}
    </div>
  )
}
