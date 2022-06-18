import { FloatingActionButton, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import Header from '@/components/header'
import UserProfileModal from '@/components/modals/UserProfile'
import ModuleModal from '@/components/modals/ModuleInfo'
import ModtreeFlow from '@/flow'
import DebugModal from '@/components/modals/Debug'
import { HomeLoader } from '@/components/Loader'
import { useUser } from '../utils'
import { useEffect, useState } from 'react'
// import { setBaseGraph } from '@/store/base'
// import { useDispatch } from 'react-redux'
// import useSWR from 'swr'

export default function Modtree() {
  const { isLoading } = useUser()
  const [loader, setLoader] = useState(true)
  // const isLoading = true
  // const dispatch = useDispatch()

  useEffect(() => {
    /** only for debugging the loader */
    const fn = setTimeout(() => {
      setLoader(false)
    }, 1000)
    return () => clearTimeout(fn)
  }, [])

  // if (!isLoading && user) {
  //   const { data, error } = useSWR(
  //     `/api/graphs/get/${user.modtree.savedGraphs[0]}`,
  //     fetcher
  //   )
  //   dispatch(setBaseGraph(data))
  //   console.log(data)
  //   if (error) console.log('SWR error:', error)
  // }

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
          <ModuleModal />
        </>
      )}
    </div>
  )
}
