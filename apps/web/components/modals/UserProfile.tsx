import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ModalState, hideUserProfile } from '@/store/modal'
import { XIcon } from '@heroicons/react/outline'

export default function UserProfileModal() {
  const showUserProfile = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  const dispatch = useDispatch()

  function closeModal() {
    dispatch(hideUserProfile())
  }

  const CloseButton = () => {
    const hover = ' hover:bg-gray-200 active:bg-gray-300 cursor-pointer'
    const center = ' flex flex-row justify-center items-center'
    const className = 'w-6 h-6 absolute right-6 rounded-md' + hover + center
    return (
      <div className={className} onClick={closeModal}>
        <XIcon className="text-gray-600 h-5 w-5" />
      </div>
    )
  }

  const UserProfileContents = () => {
    return (
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Saved graphs, degrees, modules done, modules doing.
        </p>
      </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-10" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h2"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  <CloseButton />
                  User Profile
                  <UserProfileContents />
                </Dialog.Title>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
