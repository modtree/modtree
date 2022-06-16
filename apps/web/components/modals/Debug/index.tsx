import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ModalState, hideDebugModal } from '@/store/modal'
import { CloseButton } from '@/ui/buttons'
import { useUser } from '@/utils/auth0'

export default function DebugModal() {
  const { user } = useUser()
  const showDebugModal = useSelector<ModalState, boolean>(
    (state) => state.modal.showDebugModal
  )
  const dispatch = useDispatch()

  function closeModal() {
    dispatch(hideDebugModal())
  }

  const DebugModalContents = () => {
    return (
      <div className="mt-2 border border-blue-400">
        <code>useUser().user</code>
        <pre className="p-2 bg-gray-100 overflow-hidden">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    )
  }

  const Panel = () => {
    return (
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Dialog.Panel className="overflow-y-auto w-full max-w-4xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <CloseButton close={closeModal} />
          <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Debug
          </h2>
          <DebugModalContents />
        </Dialog.Panel>
      </Transition.Child>
    )
  }

  return (
    <Transition appear show={showDebugModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-10" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden flex justify-center py-28">
          <Panel />
        </div>
      </Dialog>
    </Transition>
  )
}
