import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ModalState, hideModuleModal } from '@/store/modal'
import { CloseButton } from '@/ui/buttons'
import { ModtreeApiResponse } from '@modtree/types'
import { Dispatch } from 'redux'

function ModuleDetails(props: { module: ModtreeApiResponse.Module }) {
  const { module } = props
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-modtree-400 mb-2">
        {module.moduleCode}
      </h1>
      <h2 className="text-xl font-medium leading-6 text-gray-600 mb-3">
        {module.title}
      </h2>
      <p className="text-sm tracking-normal text-gray-500 mb-4">
        <span>{module.department}</span>{' '}
        <span aria-hidden="true">&middot;</span> <span>{module.faculty}</span>{' '}
        <span aria-hidden="true">&middot;</span>{' '}
        <span>{module.moduleCredit} MCs</span>{' '}
      </p>
      <hr className="mb-4" />
      <p className="text-gray-600 tracking-normal mb-4">{module.description}</p>
    </div>
  )
}

function AddToGraphButton(props: {
  module: ModtreeApiResponse.Module
  dispatch: Dispatch
}) {
  const { module, dispatch } = props
  function handleButtonClick() {
    dispatch(hideModuleModal())
    alert(`Add ${module.moduleCode} to graph`)
  }
  return (
    <div
      className="inline-flex h-10 items-center rounded-md bg-modtree-400 bg-opacity-90 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-60 focus:outline-none"
      onClick={handleButtonClick}
    >
      Add to graph
    </div>
  )
}

export default function ModuleModal() {
  const { modalModule, showModuleModal } = useSelector<
    ModalState,
    ModalState['modal']
  >((state) => state.modal)
  const dispatch = useDispatch()

  function closeModal() {
    dispatch(hideModuleModal())
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
        <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <CloseButton close={closeModal} />
          <ModuleDetails module={modalModule} />
          <div className="flex flex-row-reverse">
            <AddToGraphButton module={modalModule} dispatch={dispatch} />
          </div>
        </Dialog.Panel>
      </Transition.Child>
    )
  }

  return (
    <Transition appear show={showModuleModal} as={Fragment}>
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
