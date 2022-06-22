import Modal from '@/ui/modal'
import { hideUserProfile } from '@/store/modal'
import { useAppSelector } from '@/store/redux'
import SidebarWithContents from './layout'
import { contents } from './contents'

export function UserProfileModal() {
  const showState = useAppSelector((state) => state.modal.showUserProfile)
  const dev = process.env['NODE_ENV'] === 'development'
  return (
    <Modal showState={showState} hideAction={hideUserProfile} className="pr-0">
      <SidebarWithContents
        show={showState}
        contents={contents.filter((e) => dev || e.category != 'Developer')}
      />
    </Modal>
  )
}
