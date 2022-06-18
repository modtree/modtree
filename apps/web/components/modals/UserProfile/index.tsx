import { Panel } from '../base'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import PublicProfile from './public-profile'
import Account from './account'
import Modules from './modules'
import Graphs from './graphs'
import Degrees from './degrees'
import Debug from './debug'
import SidebarWithContents from './sidebar'
import { UserIcon } from '@heroicons/react/outline'

const contents = [
  { title: 'Public profile', content: <PublicProfile />, icon: UserIcon },
  { title: 'Account', content: <Account />, icon: UserIcon },
  { title: 'Graphs', content: <Graphs />, icon: UserIcon },
  { title: 'Modules', content: <Modules />, icon: UserIcon },
  { title: 'Degrees', content: <Degrees />, icon: UserIcon },
]

export default function UserProfile() {
  const showState = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  if (process.env['NODE_ENV'] === 'development') {
    contents.push({
      title: 'Debug',
      content: <Debug />,
      icon: UserIcon,
    })
  }
  return (
    <Panel showState={showState} hideAction={hideUserProfile}>
      <SidebarWithContents contents={contents} />
    </Panel>
  )
}
