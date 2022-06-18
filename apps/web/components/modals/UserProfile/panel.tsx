import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactElement } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ModalState, hideUserProfile } from '@/store/modal'
import { CloseButton } from '@/ui/buttons'
import { flatten } from '@/utils/tailwind'

const panel = flatten(
  'w-full',
  'max-w-4xl',
  'h-full',
  'overflow-hidden',
  'rounded-2xl',
  'bg-white',
  'p-6',
  'text-left',
  'align-middle',
  'shadow-xl',
  'transition-all'
)

export default function Panel(props: {
  children: ReactElement[] | ReactElement
}) {
  const showUserProfile = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  const dispatch = useDispatch()

  function closeModal() {
    dispatch(hideUserProfile())
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
        <Dialog.Panel className={panel}>
          <CloseButton close={closeModal} />
          {props.children}
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
        <div className="fixed inset-0 overflow-y-hidden flex justify-center items-center p-16">
          <Panel />
        </div>
      </Dialog>
    </Transition>
  )
}
