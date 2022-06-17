import { FloatingActionButton, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import Header from '@/components/header'
import UserProfileModal from '@/components/modals/UserProfile'
import ModuleModal from '@/components/modals/ModuleInfo'
import ModtreeFlow from '@/flow'
import DebugModal from '@/components/modals/Debug'
import { useUser, fetcher } from '@/utils'
import { setBaseGraph } from '@/store/base'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'

export default function Modtree() {
  const { user, isLoading } = useUser()
  const dispatch = useDispatch()

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
      <ModtreeFlow />
      <Header />
      <FullScreenOverlay>
        <FloatingUserButton />
        <FloatingActionButton />
      </FullScreenOverlay>
      <UserProfileModal />
      <DebugModal />
      <ModuleModal />
    </div>
  )
}
