import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { CloseButton } from '@/ui/buttons'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { flatten } from '@/utils/tailwind'

export default function Panel(props: {
  children: ReactElement[] | ReactElement
  showState: boolean
  hideAction: ActionCreatorWithoutPayload<string>
  closeButton?: boolean
  scrollable?: boolean
}) {
  const dispatch = useDispatch()
  function closeModal() {
    dispatch(props.hideAction())
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
        <Dialog.Panel className="w-full max-w-4xl h-full overflow-hidden rounded-2xl bg-white py-6 px-4 text-left align-middle shadow-xl transition-all">
          {props.closeButton && (
            <CloseButton close={closeModal} bg="bg-white" />
          )}
          <div
            className={flatten(
              'h-full px-2',
              props.scrollable && 'overflow-y-auto'
            )}
          >
            {props.children}
          </div>
        </Dialog.Panel>
      </Transition.Child>
    )
  }

  return (
    <Transition appear show={props.showState} as={Fragment}>
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
