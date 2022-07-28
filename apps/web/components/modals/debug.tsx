import { useAppSelector, r } from '@/store/redux'
import { useSession } from '@/utils/auth'
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
  const { user } = useSession()
  /**
   * get entire redux store
   */
  const redux = useAppSelector((s) => s)

  const DebugModalContents = () => {
    return (
      <div className="mt-2">
        <h2>user</h2>
        <Content>{user ? user : {}}</Content>

        <h2>Redux Graph State</h2>
        <Content>
          {{
            ...redux.graph,
            flowNodes: redux.graph.flowNodes.map((n) => [n.id, n.type]),
          }}
        </Content>

        <h2>Redux User State</h2>
        <Content>{redux.modtree.user}</Content>

        <h2>Redux Degree State</h2>
        <Content>{redux.modtree.degree}</Content>

        <h2>Redux Module Condensed Cache</h2>
        <Content>{redux.cache.modulesCondensed}</Content>

        <h2>Redux ModalState</h2>
        <Content>{redux.modal}</Content>
      </div>
    )
  }

  return (
    <Modal
      showState={redux.modal.showDebugModal}
      hideAction={r.hideDebugModal}
      closeButton
      scrollable
    >
      <h2>Debug</h2>
      <DebugModalContents />
    </Modal>
  )
}
