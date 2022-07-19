import { ModuleStateGuide, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import ModtreeFlow from '@/components/flow/pane'
import { HomeLoader } from '@/components/Loader'
import { useEffect } from 'react'
import { ContextMenus } from '@/ui/menu/context-menu'
import { ModuleInfoModal, DebugModal } from '@/components/modals'
import { UserProfileModal } from '@/components/user-profile'
import { RootSearchBox } from '@/ui/search/module'
import { rehydrate } from '@/utils/rehydrate'
import { FloatingGraphTitle } from '@/components/graph-title'
import { useSession } from '@/utils/auth'

export default function Modtree() {
  const { user, status } = useSession()

  /**
   * load current user, current graph, current degree
   */
  useEffect(() => {
    if (status === 'authenticated' && user) {
      rehydrate(user)
    }
  }, [status])

  return (
    <div className="fixed inset-0 bg-gray-50">
      {status === 'loading' ? (
        <HomeLoader />
      ) : (
        <>
          <ModtreeFlow />
          <RootSearchBox />
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
