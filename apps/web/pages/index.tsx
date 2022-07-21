import { ModuleStateGuide, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import ModtreeFlow from '@/components/flow/pane'
import { HomeLoader } from '@/components/Loader'
import { useEffect } from 'react'
import { ContextMenus } from '@/ui/menu/context-menu'
import { ModuleInfoModal, DebugModal } from '@/components/modals'
import { UserProfileModal } from '@/components/user-profile'
import { RootSearchBox } from '@/ui/search/module'
import { FloatingGraphTitle } from '@/components/graph-title'
import { useSession } from '@/utils/auth'
import { useAppDispatch, useAppSelector, r } from '@/store/redux'
import { trpcReact } from '@/utils/trpc'

export default function Modtree() {
  const { user, status } = useSession()
  const dispatch = useAppDispatch()
  const state = useAppSelector((s) => s.modtree)

  /** trpc hooks that will auto-refetch upon any change in request params */
  const opts = { keepPreviousData: true, enabled: status === 'authenticated' }
  trpcReact.useQuery(['user', user ? user.modtreeId : ''], {
    onSuccess: (user) => dispatch(r.setUser(user)),
    ...opts,
  })
  trpcReact.useQuery(['degree', state.user.mainDegree], {
    onSuccess: (degree) => dispatch(r.setMainDegree(degree)),
    ...opts,
  })
  trpcReact.useQuery(['graph', state.user.mainGraph], {
    onSuccess: (graph) => dispatch(r.setMainGraph(graph)),
    ...opts,
  })

  /**
   * hide the context menu on a click anywhere
   */
  useEffect(() => {
    document.addEventListener('click', () => dispatch(r.hideContextMenu()))
  }, [])

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
