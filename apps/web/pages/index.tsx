import { FloatingActionButton, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import ModtreeFlow from 'flow'
import { HomeLoader } from '@/components/Loader'
import { useUser } from '@/utils/auth0'
import { useEffect } from 'react'
import { ContextMenus } from '@/components/context-menu'
import { ModuleInfoModal, DebugModal } from '@/components/modals'
import { UserProfileModal } from '@/components/user-profile'
import { RootSearchBox } from '@/ui/search'
import { rehydrate } from '@/utils/rehydrate'

export default function Modtree() {
  const { isLoading, user } = useUser()

  /**
   * load current user, current graph, current degree
   */
  useEffect(() => {
    if (!isLoading && user) {
      rehydrate(user)
    }
  }, [isLoading])

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
