import { FloatingActionButton, FloatingUserButton } from '@/components/buttons'
import { FullScreenOverlay } from '@/components/Views'
import Header from '@/components/header'
import UserProfileModal from '@/components/modals/UserProfile'
import ModuleModal from '@/components/modals/ModuleInfo'
import ModtreeFlow from '../flow'

export default function Modtree() {
  return (
    <div className="fixed inset-0 bg-gray-50">
      <ModtreeFlow />
      <Header />
      <FullScreenOverlay>
        <FloatingUserButton />
        <FloatingActionButton />
      </FullScreenOverlay>
      <UserProfileModal />
      <ModuleModal />
    </div>
  )
}
