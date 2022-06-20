import Modal from '@/ui/modal'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import SidebarWithContents from './layout'
import { contents } from './contents'

export function UserProfileModal() {
  const showState = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  return (
    <Modal showState={showState} hideAction={hideUserProfile} className="pr-0">
      <SidebarWithContents show={showState} contents={contents} />
    </Modal>
  )
}
