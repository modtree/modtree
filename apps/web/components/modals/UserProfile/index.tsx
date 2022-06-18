import { Panel } from '../base'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import SavedGraphs from './saved-graphs'

const Contents = () => {
  return (
    <div className="bg-green-100">
      <SavedGraphs />
      <SavedGraphs />
      <SavedGraphs />
      <SavedGraphs />
    </div>
  )
}

export default function UserProfile() {
  const showState = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  return (
    <Panel showState={showState} hideAction={hideUserProfile}>
      <Contents />
    </Panel>
  )
}
