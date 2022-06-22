import { FloatingActionButton, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import Header from '@/components/header'
import ModtreeFlow from '@/flow'
import { HomeLoader } from '@/components/Loader'
import { useUser } from '@/utils/auth0'
import { useEffect, useState } from 'react'
import { ContextMenus } from '@/components/context-menu'
import { ModuleInfoModal, DebugModal } from '@/components/modals'
import { UserProfileModal } from '@/components/user-profile'

export default function Modtree() {
  const { isLoading } = useUser()
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    /** only for debugging the loader */
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
          <Header />
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
