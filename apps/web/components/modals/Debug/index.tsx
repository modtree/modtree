import { useSelector } from 'react-redux'
import { ModalState, hideDebugModal } from '@/store/modal'
import { useUser } from '@/utils/auth0'
import { UserState } from '@/store/base'
import { ObjectLiteral } from 'typeorm'
import Modal from '@/ui/modal'

const Content = (props: { children: ObjectLiteral }) => {
  return (
    <div className="p-4 bg-gray-100 mb-4">
      <pre className="overflow-hidden">
        {JSON.stringify(props.children, null, 2)}
      </pre>
    </div>
  )
}

export function DebugModal() {
  const { user } = useUser()
  const redux = {
    modal: useSelector<ModalState, ModalState['modal']>((state) => state.modal),
    user: useSelector<UserState, UserState['base']>((state) => state.base),
  }

  const DebugModalContents = () => {
    return (
      <div className="mt-2">
        <h2>useUser().user</h2>
        <Content>{user}</Content>
        <h2>Redux UserState</h2>
        <Content>{redux.user}</Content>
        <h2>Redux ModalState</h2>
        <Content>{redux.modal}</Content>
      </div>
    )
  }

  return (
    <Modal
      showState={redux.modal.showDebugModal}
      hideAction={hideDebugModal}
      closeButton
      scrollable
    >
      <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Debug
      </h2>
      <DebugModalContents />
    </Modal>
  )
}
