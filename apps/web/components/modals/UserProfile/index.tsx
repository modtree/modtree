import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ModalState, hideUserProfile } from '@/store/modal'
import { CloseButton } from '@/ui/buttons'
import SavedGraphs from './SavedGraphs'
import ModulesDone from './ModulesDone'

export default function UserProfileModal() {
  const showUserProfile = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  const dispatch = useDispatch()

  function closeModal() {
    dispatch(hideUserProfile())
  }

  const UserProfileContents = () => {
    return (
      <div className="mt-2 h-full grid grid-cols-3 space-x-6">
        <div>
          <h3 className="mb-4">Saved Graphs</h3>
          <SavedGraphs />
        </div>
        <h3>Saved Degrees</h3>
        <div className="h-full overflow-y-hidden">
          <h3 className="mb-4">Modules Done</h3>
          <ModulesDone />
        </div>
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
        <Dialog.Panel className="h-96 w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <CloseButton close={closeModal} />
          <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            User Profile
          </h2>
          <UserProfileContents />
        </Dialog.Panel>
      </Transition.Child>
    )
  }

  return (
    <Transition appear show={showUserProfile} as={Fragment}>
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
        <div className="fixed inset-0 overflow-y-hidden">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Panel />
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
