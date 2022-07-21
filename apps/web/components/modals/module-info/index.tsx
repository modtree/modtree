import { useAppSelector, r } from '@/store/redux'
import Modal from '@/ui/modal'
import { ModuleDetails } from './contents'

export function ModuleInfoModal() {
  const showModuleModal = useAppSelector((state) => state.modal.showModuleModal)

  return (
    <Modal
      showState={showModuleModal}
      hideAction={r.hideModuleModal}
      closeButton
      minHeight
      cypressCloseButton="module-modal-close-button"
    >
      <ModuleDetails />
    </Modal>
  )
}
