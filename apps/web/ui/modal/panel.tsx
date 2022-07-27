import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactElement } from 'react'
import { CloseButton } from '@/ui/buttons'
import { cc } from '@/utils/tailwind'

export type ModalPanelProps = {
  children: ReactElement[] | ReactElement
  closeButton?: boolean
  scrollable?: boolean
  className?: string
  closeModal: () => void
  minHeight?: boolean
  cypressCloseButton?: string
}

export function Panel(props: ModalPanelProps) {
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
      <Dialog.Panel
        className={cc(
          'w-full',
          // 'border border-blue-500',
          props.minHeight ? 'max-h-full' : 'h-full',
          'relative max-w-4xl rounded-2xl bg-white',
          'py-6 align-middle shadow-xl transition-all'
        )}
      >
        {props.closeButton && (
          <div className="w-6 h-6 absolute right-6">
            <CloseButton
              close={props.closeModal}
              cypressCloseButton={props.cypressCloseButton}
            />
          </div>
        )}
        <div
          className={cc(
            'h-full px-6',
            // 'border border-red-500',
            props.scrollable ? 'overflow-y-auto' : 'overflow-y-hidden',
            props.className
          )}
        >
          {props.children}
        </div>
      </Dialog.Panel>
    </Transition.Child>
  )
}
