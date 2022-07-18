import { ModuleStateGuide, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import ModtreeFlow from '@/components/flow/pane'
import { HomeLoader } from '@/components/Loader'
import { useUser } from '@/utils/auth0'
import { useEffect, useState } from 'react'
import { ContextMenus } from '@/ui/menu/context-menu'
import { ModuleInfoModal, DebugModal } from '@/components/modals'
import { UserProfileModal } from '@/components/user-profile'
import { RootSearchBox } from '@/ui/search/module'
import { rehydrate } from '@/utils/rehydrate'
import { FloatingGraphTitle } from '@/components/graph-title'
import { Onboarding } from '@/components/steps'

export default function Modtree() {
  const { isLoading, user } = useUser()

  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  /**
   * load current user, current graph, current degree
   */
  useEffect(() => {
    if (!isLoading && user) {
      rehydrate(user)
    }
  }, [isLoading])

  useEffect(() => {
    if (user) setLoggedIn(true)
  }, [user])

  return (
    <div className="fixed inset-0 bg-gray-50">
      {isLoading ? (
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
          <Onboarding loggedIn={loggedIn} />
          <FullScreenOverlay>
            <FloatingGraphTitle />
            <FloatingUserButton />
            <ModuleStateGuide />
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
