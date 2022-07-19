import Modal from '@/ui/modal'
import { hideUserProfile } from '@/store/modal'
import { useAppSelector } from '@/store/redux'
import SidebarWithContents from './layout'
import { contents } from './contents'

export function UserProfileModal() {
  const showState = useAppSelector((state) => state.modal.showUserProfile)
  return (
    <Modal showState={showState} hideAction={hideUserProfile} className="pr-0">
      <SidebarWithContents show={showState} contents={contents} />
    </Modal>
  )
}
