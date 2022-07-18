import { useAppSelector } from '@/store/redux'
import { hideModuleModal } from '@/store/modal'
import Modal from '@/ui/modal'
import { ModuleDetails } from './contents'

export function ModuleInfoModal() {
  const showModuleModal = useAppSelector((state) => state.modal.showModuleModal)

  return (
    <Modal
      showState={showModuleModal}
      hideAction={hideModuleModal}
      closeButton
      minHeight
      cypressCloseButton="module-modal-close-button"
    >
      <ModuleDetails />
    </Modal>
  )
}
