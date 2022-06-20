import { useSelector } from 'react-redux'
import { ModalState, hideModuleModal } from '@/store/modal'
import Modal from '@/ui/modal'
import { ModuleDetails } from './contents'

export function ModuleInfoModal() {
  const showModuleModal = useSelector<ModalState, boolean>(
    (state) => state.modal.showModuleModal
  )

  return (
    <Modal
      showState={showModuleModal}
      hideAction={hideModuleModal}
      closeButton
      minHeight
    >
      <ModuleDetails />
    </Modal>
  )
}
