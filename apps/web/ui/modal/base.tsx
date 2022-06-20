import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactElement } from 'react'

export type ModalBaseProps = {
  showState: boolean
  closeModal: () => void
  children: ReactElement | ReactElement[]
}

export function Base(props: ModalBaseProps) {
  return (
    <Transition appear show={props.showState} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.closeModal}>
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
          {props.children}
        </div>
      </Dialog>
    </Transition>
  )
}
