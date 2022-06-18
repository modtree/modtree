import { Panel } from '../base'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import PublicProfile from './public-profile'
import Account from './account'
import Modules from './modules'
import Graphs from './graphs'
import Degrees from './degrees'
import SidebarWithContents from './sidebar'

export default function UserProfile() {
  const showState = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  return (
    <Panel showState={showState} hideAction={hideUserProfile}>
      <SidebarWithContents
        contents={[
          ['Public profile', <PublicProfile />],
          ['Account', <Account />],
          ['Graphs', <Graphs />],
          ['Modules', <Modules />],
          ['Degrees', <Degrees />],
        ]}
      />
    </Panel>
  )
}
